import React from "react"
import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from "react-icons/cg"
import { Flex, Button, ButtonGroup, IconButton } from "@chakra-ui/react"

import { CharacterItemInList } from "pages/characters/types"

interface Props {
  pageIndex: number
  setPageIndex: (index: number) => void
  pages: CharacterItemInList[][]
}

function Pagination(props: Props) {
  const { pageIndex, setPageIndex, pages } = props
  return (
    <Flex
      as={ButtonGroup}
      isAttached
      variant="ghost"
      marginTop="1rem"
      borderBottomWidth="1px"
      justifyContent="center"
    >
      <IconButton
        aria-label="first page"
        onClick={() => {
          setPageIndex(0)
        }}
      >
        <CgChevronDoubleLeft />
      </IconButton>
      <IconButton
        aria-label="previous page"
        onClick={() => {
          setPageIndex(pageIndex - 1 || 0)
        }}
      >
        <CgChevronLeft />
      </IconButton>
      {pages.map((chunk, index: number) => (
        <Button
          key={index}
          fontWeight="normal"
          isActive={index === pageIndex}
          onClick={() => {
            setPageIndex(index)
          }}
        >
          {index + 1}
        </Button>
      ))}
      <IconButton
        aria-label="next page"
        onClick={() => {
          setPageIndex(
            pageIndex < pages.length - 1 ? pageIndex + 1 : pages.length,
          )
        }}
      >
        <CgChevronRight />
      </IconButton>
      <IconButton
        aria-label="last page"
        onClick={() => {
          setPageIndex(pages.length - 1)
        }}
      >
        <CgChevronDoubleRight />
      </IconButton>
    </Flex>
  )
}

export default Pagination
