import React, { useEffect } from "react"
import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from "react-icons/cg"
import { Flex, Button, ButtonGroup, IconButton } from "@chakra-ui/react"

import { UserItemInList } from "pages/items/types"

interface Props {
  pageIndex: number
  setPageIndex(index: number): void
  pages: UserItemInList[][]
}

function Pagination(props: Props) {
  const { pageIndex, setPageIndex, pages } = props
  const lastPageIndex = pages.length > 0 ? pages.length - 1 : 0
  const goFirst = () => {
    if (pageIndex === 0) return
    setPageIndex(0)
  }
  const goPrev = () => {
    if (pageIndex === 0) return
    setPageIndex(pageIndex - 1)
  }
  const goNext = () => {
    if (!pages.length) return
    if (pageIndex === lastPageIndex) return
    setPageIndex(pageIndex + 1)
  }
  const goLast = () => {
    if (!pages.length) return
    setPageIndex(lastPageIndex)
  }
  useEffect(() => {
    if (pageIndex > lastPageIndex) {
      setPageIndex(lastPageIndex)
    }
    if (pageIndex < 0) {
      console.log(pageIndex)
    }
  }, [pageIndex, setPageIndex, pages.length])

  return (
    <Flex
      as={ButtonGroup}
      isAttached
      variant="ghost"
      marginTop="1rem"
      borderBottomWidth="1px"
      justifyContent="center"
    >
      <IconButton aria-label="first page" onClick={goFirst}>
        <CgChevronDoubleLeft />
      </IconButton>
      <IconButton aria-label="previous page" onClick={goPrev}>
        <CgChevronLeft />
      </IconButton>
      {pages.map((chunk, index: number) => {
        const isOutofScope = index > pageIndex + 10 || index < pageIndex - 10
        const isOnEdge = index === pageIndex + 10 || index === pageIndex - 10
        return (
          <Button
            key={index}
            fontWeight="normal"
            isActive={index === pageIndex}
            padding={isOutofScope ? 0 : ""}
            fontSize={isOutofScope ? 0 : ""}
            minWidth={isOutofScope ? 0 : ""}
            transition="padding 0.25s ease-out, min-width 0.25s ease-out"
            onClick={() => {
              setPageIndex(index)
            }}
          >
            {isOnEdge ? "..." : index + 1}
          </Button>
        )
      })}
      <IconButton aria-label="next page" onClick={goNext}>
        <CgChevronRight />
      </IconButton>
      <IconButton aria-label="last page" onClick={goLast}>
        <CgChevronDoubleRight />
      </IconButton>
    </Flex>
  )
}

export default Pagination
