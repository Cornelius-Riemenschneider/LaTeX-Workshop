import {latexParser, bibtexParser} from 'latex-utensils'
import * as path from 'path'
import * as workerpool from 'workerpool'

import {Extension} from '../../main'

export class UtensilsParser {
    extension: Extension
    pool: workerpool.WorkerPool
    constructor(extension: Extension) {
        this.extension = extension
        this.pool = workerpool.pool(
            path.join(__dirname, 'syntax_worker.js'),
            { minWorkers: 1, maxWorkers: 1, workerType: 'process' }
        )
    }

    async parseLatex(s: string, options?: latexParser.ParserOptions): Promise<latexParser.LatexAst | undefined> {
        try {
            return await this.pool.exec('parseLatex', [s, options]).timeout(3000)
        } catch(e) {
            return undefined
        }
    }

    async parseLatexPreamble(s: string): Promise<latexParser.AstPreamble> {
        return await this.pool.exec('parseLatexPreamble', [s]).timeout(500)
    }

    async parseBibtex(s: string, options?: bibtexParser.ParserOptions): Promise<bibtexParser.BibtexAst> {
        return await this.pool.exec('parseBibtex', [s, options]).timeout(30000)
    }

}
