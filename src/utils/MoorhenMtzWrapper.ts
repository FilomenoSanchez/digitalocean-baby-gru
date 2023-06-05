import { v4 as uuidv4 } from 'uuid';
import { readDataFile } from "./MoorhenUtils";

interface MoorhenMtzWrapperInterface {
    reflectionData: null | Uint8Array;
    columns: { [colType: string]: string };
}

export class MoorhenMtzWrapper implements MoorhenMtzWrapperInterface {

    reflectionData: null | Uint8Array;
    columns: { [colType: string]: string };

    constructor() {
        this.reflectionData = null
        this.columns = {}
    }
    
    loadHeaderFromFile(file) {
        return new Promise((resolve, reject) => {
            readDataFile(file)
                .then(arrayBuffer => {
                    const fileName = `File_${uuidv4()}`
                    const byteArray = new Uint8Array(arrayBuffer)
                    window.CCP4Module.FS_createDataFile(".", fileName, byteArray, true, true);
                    const header_info = window.CCP4Module.get_mtz_columns(fileName);
                    window.CCP4Module.FS_unlink(`./${fileName}`)
                    let newColumns = {}
                    for (let ih = 0; ih < header_info.size(); ih += 2) {
                        newColumns[header_info.get(ih + 1)] = header_info.get(ih)
                    }
                    this.columns = newColumns
                    this.reflectionData = byteArray
                    resolve(newColumns)
                })
        })
    }
}