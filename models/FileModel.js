import { basename } from 'path'
import { fileIs } from '../core/fs'
import uuid from 'uuid/v4'

export function FileModel(path) {
    if (!(this instanceof FileModel)) throw new Error('use `new File()`')

    const file = {
        id: uuid(),
        name: basename(path),
        isHaveWatermark: false,
        path,
        size: 'в очереди',
        type: fileIs('video', path) 
            ? 'video' 
            : 'image'
    }

    return file
}