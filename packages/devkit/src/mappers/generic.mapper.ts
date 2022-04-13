import { IPressMapper } from '../../src/builders';
import { unlinkFile, writeJSON } from '../../src/utils/filesystem';
import { MAP_FILES } from '../models/constants';
import { IMetaData, IParsedContent } from '../models/mappers/generic';

const memory = {};

export function getGenericMapper(): IPressMapper {
  return {
    push: async (parsed: IParsedContent, filePath: string, extra) => {
      memory[filePath] = parsed as unknown as IMetaData;
      filePath = filePath.replace(/\..+$/, '.json');
      await writeJSON(filePath, parsed, {
        dir: extra.outputPath,
        logger: extra.context.logger
      });
      await writeJSON(MAP_FILES.main, Object.values(memory), {
        dir: extra.outputPath
      });
    },
    remove: async (filePath: string, extra) => {
      delete memory[filePath];
      filePath = filePath.replace(/\..+$/, '.json');
      await unlinkFile(filePath, {
        dir: extra.outputPath,
        logger: extra.context.logger
      });
      await writeJSON(MAP_FILES.main, Object.values(memory), {
        dir: extra.outputPath
      });
    }
  };
}