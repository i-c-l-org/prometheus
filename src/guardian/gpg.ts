// SPDX-License-Identifier: MIT-0
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { config } from '@core/config/config.js';
import { log } from '@core/messages/index.js';

const execFileAsync = promisify(execFile);

export interface GpgSignature {
  assinatura: string;
  assinante: string;
  keyId?: string;
  timestamp: string;
}

export interface GpgVerificationResult {
  valido: boolean;
  assinante?: string;
  keyId?: string;
  mensagem?: string;
}

export async function verificarGpgInstalado(): Promise<boolean> {
  try {
    await execAsync('gpg --version', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export async function listarChavesPublicas(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('gpg --list-keys --with-colons', { timeout: 10000 });
    const keys: string[] = [];
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        if (parts[9]) {
          keys.push(parts[9]);
        }
      }
    }
    return keys;
  } catch {
    return [];
  }
}

export async function listarChavesPrivadas(): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync('gpg', ['--list-secret-keys', '--with-colons'], { timeout: 10000 });
    const keys: string[] = [];
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        if (parts[9]) {
          keys.push(parts[9]);
        }
      }
    }
    return keys;
  } catch {
    return [];
  }
}

export async function obterKeyIdPadrao(): Promise<string | null> {
  const chaveConfig = config.GUARDIAN_GPG_KEY_ID;
  if (chaveConfig) {
    return chaveConfig;
  }
  try {
    const { stdout } = await execFileAsync('gpg', ['--list-secret-keys', '--keyid-format', 'LONG', '--with-colons'], { timeout: 10000 });
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('sec:')) {
        const parts = line.split(':');
        const keyId = parts[4];
        if (keyId) {
          return keyId;
        }
      }
    }
  } catch {
  }
  return null;
}

export async function assinarConteudo(conteudo: string, keyId?: string): Promise<GpgSignature | null> {
  const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
  if (!gpgHabilitado) {
    return null;
  }
  const instalado = await verificarGpgInstalado();
  if (!instalado) {
    log.aviso('🛡️ GPG não instalado. Assinatura desabilitada.');
    return null;
  }
  const keyIdReal = keyId || await obterKeyIdPadrao();
  if (!keyIdReal) {
    log.aviso('🛡️ Nenhuma chave GPG encontrada. Assinatura desabilitada.');
    return null;
  }
  try {
    const passphrase = config.GUARDIAN_GPG_PASSPHRASE || '';
    let stdout = '';
    if (passphrase) {
      const { writeFile, unlink } = await import('node:fs/promises');
      const passFile = `/tmp/prometheus_gpg_pass_${Date.now()}.txt`;
      await writeFile(passFile, passphrase, 'utf-8');
      const result = await execFileAsync(
        'gpg',
        ['--batch', '--yes', '--armor', '--sign', '--local-user', keyIdReal, '--passphrase-file', passFile],
        { timeout: 30000, input: conteudo }
      );
      stdout = result.stdout;
      await unlink(passFile).catch(() => {});
    } else {
      const result = await execFileAsync(
        'gpg',
        ['--batch', '--yes', '--armor', '--sign', '--local-user', keyIdReal],
        { timeout: 30000, input: conteudo }
      );
      stdout = result.stdout;
    }
    const { stdout: infoStdout } = await execFileAsync(
      'gpg',
      ['--batch', '--verify', '--local-user', keyIdReal],
      { timeout: 30000, input: conteudo }
    );
    let assinante = keyIdReal;
    let signKeyId: string | undefined;
    const infoLines = infoStdout.split('\n');
    for (const line of infoLines) {
      if (line.includes('signature from')) {
        const match = line.match(/signature from\s+["']([^"']+)["']/i) || line.match(/key\s+ID\s+([A-F0-9]+)/i);
        if (match) {
          assinante = match[1];
          signKeyId = match[1];
        }
      }
    }
    return {
      assinatura: stdout,
      assinante,
      keyId: signKeyId,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    const erroMsg = err instanceof Error ? err.message : String(err);
    log.aviso(`🛡️ Erro ao assinar com GPG: ${erroMsg}`);
    return null;
  }
}

export async function verificarAssinatura(conteudo: string, assinatura: string): Promise<GpgVerificationResult> {
  const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
  if (!gpgHabilitado) {
    return { valido: true, mensagem: 'GPG desabilitado, verificação por hash apenas' };
  }
  const instalado = await verificarGpgInstalado();
  if (!instalado) {
    return { valido: true, mensagem: 'GPG não instalado, verificação por hash apenas' };
  }
  try {
    const tempFile = `/tmp/prometheus_gpg_verify_${Date.now()}.sig`;
    const { writeFile, unlink } = await import('node:fs/promises');
    await writeFile(tempFile, assinatura, 'utf-8');
    const { stdout, stderr } = await execAsync(
      `echo -n "${conteudo.replace(/"/g, '\\"')}" | gpg --batch --verify ${tempFile} 2>&1`,
      { timeout: 30000 }
    );
    await unlink(tempFile);
    const output = stdout + stderr;
    if (output.includes('Good signature') || output.includes('Valida')) {
      let assinante: string | undefined;
      let keyId: string | undefined;
      const matchAssinante = output.match(/signature\s+from\s+["']([^"']+)["']/i) || output.match(/from\s+["']([^"']+)["']/i);
      const matchKeyId = output.match(/key\s+ID\s+([A-F0-9]+)/i);
      if (matchAssinante) {
        assinante = matchAssinante[1];
      }
      if (matchKeyId) {
        keyId = matchKeyId[1];
      }
      return {
        valido: true,
        assinante,
        keyId,
        mensagem: 'Assinatura válida'
      };
    }
    return {
      valido: false,
      mensagem: output.includes('BAD signature') ? 'Assinatura inválida' : 'Não foi possível verificar assinatura'
    };
  } catch (err) {
    const erroMsg = err instanceof Error ? err.message : String(err);
    return {
      valido: false,
      mensagem: `Erro ao verificar assinatura: ${erroMsg}`
    };
  }
}

export async function obterInfoChave(keyId: string): Promise<{ nome?: string; email?: string; keyId?: string } | null> {
  try {
    const { stdout } = await execAsync(`gpg --list-keys --keyid-format LONG ${keyId}`, { timeout: 10000 });
    const lines = stdout.split('\n');
    const currentKey: { nome?: string; email?: string; keyId?: string } = {};
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        const uid = parts[9] || '';
        const nameMatch = uid.match(/^([^<]+)/);
        const emailMatch = uid.match(/<([^>]+)>/);
        if (nameMatch) {
          currentKey.nome = nameMatch[1].trim();
        }
        if (emailMatch) {
          currentKey.email = emailMatch[1].trim();
        }
      }
      if (line.startsWith('sec:')) {
        const parts = line.split(':');
        currentKey.keyId = parts[4];
      }
    }
    return currentKey.nome || currentKey.email ? currentKey : null;
  } catch {
    return null;
  }
}
