export const TopicTypes = [
  'topic',
  'gender',
  'file',
  'career',
  'contact-info',
  'post',
  'visibility'
];

export interface Topic {
  id: number;
  topicname: string; // 50
  logo: string;
  title: string; // 50
  description?: string; // 255
  aliases: string[]; // 50
  types: (
    | 'topic' // set by default
    | 'gender'
    | 'file'
    | 'career'
    | 'contact-info'
    | 'post'
    | 'visibility'
  )[];
}
