/* eslint-disable no-unused-vars */
import React from 'react'
import Select, { components } from 'react-select'
import { FixedSizeList as List } from 'react-window'

const height = 35 // Height of each option
const numVisibleOptions = 10 // Number of options visible at once

// Custom MenuList to render options with react-window
const MenuList = (props) => {
  const { options, children, getValue } = props
  const totalHeight = height * Math.min(options.length, numVisibleOptions)
  const [value] = getValue()
  const initialOffset = options.findIndex(option => option.value === value?.value) * height

  return (
    <List
      height={totalHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {children[index]}
        </div>
      )}
    </List>
  )
}

// Custom Option component to handle click and style
const Option = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        {props.data.label}
      </div>
    </components.Option>
  )
}

export const VirtualizedSelect = ({ options, ...props }) => {
  return (
    <Select
      options={options}
      components={{
        MenuList,
        Option
      }}
      {...props}
    />
  )
}
