export interface ISearchProvider {
  name: string;
  search(query: string): Promise<any>;
}
