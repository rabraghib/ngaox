import { IPressMapper } from '../index';
import { IParsedContent, IDocsItem, IDocsSection } from '@ngaox/press';

function getSlug(section?: IDocsSection, slug?: string, filePath?: string) {
  return `${section?.routesPrefix ?? ''}${
    slug ??
    filePath
      .replace(new RegExp(`^(${section?.directory ?? ''}/)`), '')
      .replace(/\..+$/, '') ??
    ''
  }`;
}

export function getDocsPressMapper(
  sections: IDocsSection[]
): IPressMapper<IDocsSection[], IDocsItem> {
  return {
    empty: sections,
    mapValues: (curr, filePath: string, parsed: IParsedContent) => {
      const section = curr.find(
        section =>
          !section?.directory || filePath.startsWith(section?.directory + '/')
      );
      const slug = getSlug(section, parsed.data.slug, filePath);
      const name =
        parsed.data.name ??
        (slug.replace(/-/g, ' ') as string).replace(/^\w/, c =>
          c.toUpperCase()
        );
      const metadata = {
        ...parsed.data
      };
      delete metadata.slug;
      delete metadata.title;
      return [
        `${slug}.json`,
        {
          name: name,
          slug: slug,
          content: parsed.content,
          metadata: { ...metadata, filePath },
          toc: parsed.toc
        }
      ];
    },
    push: (previous, filePath, obj) => {
      const section = previous.find(
        sec => !sec?.directory || filePath.startsWith(sec?.directory + '/')
      );
      const item = {
        ...obj
      };
      delete item.content;
      delete item.toc;
      return [
        ...previous.filter(sec => sec !== section),
        {
          ...section,
          items: [
            ...(section?.items ?? []).filter(
              item => item.metadata.filePath !== filePath
            ),
            item
          ]
        }
      ];
    },
    remove: (previous, filePath: string) => {
      let outFilePath: string;
      const section = previous.find(section =>
        section.items?.some(item => {
          if (item.metadata.filePath === filePath) {
            outFilePath = item.slug + '.json';
            return true;
          }
          return false;
        })
      );
      return [
        [
          ...previous.filter(sec => sec !== section),
          {
            ...section,
            items: section.items.filter(
              item => item.metadata.filePath !== filePath
            )
          }
        ],
        outFilePath
      ];
    }
  };
}