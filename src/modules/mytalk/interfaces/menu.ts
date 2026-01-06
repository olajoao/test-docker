export interface MenuSubitemsArray {
  id: number
  title: string
  url: string
  newTab?: boolean
}

export interface MenuItemsArray {
  title: string | null,
  subitems: MenuSubitemsArray[] 
}
