import { Input, Portal, Select, createListCollection } from "@chakra-ui/react"

export default function Filters({filter, setFilter}){
  const options = createListCollection({
    items: [
      { label: "Сначала новые", value: "desc" },
      { label: "Сначала старые", value: "asc" }
    ],
  })

    return (
        <div className="flex flex-col gap-5">
        <Input 
        placeholder="Поиск"
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
         />
         
        <Select.Root collection={options} onChange={(e) => setFilter({ ...filter, sortOrder: e.target.value })}>
          <Select.HiddenSelect />
          <Select.Label>Фильтр</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Выберите" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {options.items.map((options) => (
                <Select.Item item={options} key={options.value}>
                  {options.label}
                  <Select.ItemIndicator />
                </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </div>
    )
}