import CryptoJS from 'crypto-js'

export const encryptData = (data: string, password: string): string => {
  // Шифрование с паролем
  return CryptoJS.AES.encrypt(data, password).toString()
}

export const decryptData = (encrypted: string, password: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password)
    const result = bytes.toString(CryptoJS.enc.Utf8)
    if (!result) throw new Error('Decryption failed')
    return result
  } catch (error) {
    throw new Error('Wrong password or corrupted data')
  }
}
