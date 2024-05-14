import React from 'react'
import Select from 'react-select'
import { FixedSizeList as List } from 'react-window'

// const options = [] // Your 20,000 options

export const MenuList = ({ options, maxHeight, getValue }) => {
    const height = 35 // Height of each option
    const numVisibleOptions = 10 // Number of options visible at once
    const totalHeight = height * Math.min(options.length, numVisibleOptions)
    const [value] = getValue()
    const initialOffset = options.findIndex(option => option?.value === value?.value) * height

    return (
      <List
        height={totalHeight}
        itemCount={options.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
        width="100%"
        maxHeight={maxHeight}
      >
        {({ index, style = {padding: '10px'} }) => (
          <div style={style}>
            {options[index] && (
              <div onClick={() => onChange} style={{ cursor: 'pointer' }}>
                {options[index].label}
              </div>
            )}
          </div>
        )}
      </List>
    )
}

// export const VirtualizedSelect = ({ options, ...props }) => {

//   return <Select options={options} components={{ MenuList }} {...props} />
// }