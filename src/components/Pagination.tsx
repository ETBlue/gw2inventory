import { useEffect } from "react"

import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react"

import {
  CgChevronDoubleLeft,
  CgChevronDoubleRight,
  CgChevronLeft,
  CgChevronRight,
} from "react-icons/cg"

import { PAGINATION } from "~/constants"
import { UserItemInList } from "~/types/items"

interface Props<T = UserItemInList> {
  pageIndex: number
  setPageIndex(index: number): void
  pages: T[][]
}

function Pagination<T = UserItemInList>(props: Props<T>) {
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
      borderBottomWidth="1px"
      justifyContent="center"
    >
      <IconButton aria-label="first page" onClick={goFirst}>
        <CgChevronDoubleLeft />
      </IconButton>
      <IconButton aria-label="previous page" onClick={goPrev}>
        <CgChevronLeft />
      </IconButton>
      {pages.map((_, index: number) => {
        const isOutofScope =
          index > pageIndex + PAGINATION.VISIBLE_PAGE_RANGE ||
          index < pageIndex - PAGINATION.VISIBLE_PAGE_RANGE
        const isOnEdge =
          index === pageIndex + PAGINATION.VISIBLE_PAGE_RANGE ||
          index === pageIndex - PAGINATION.VISIBLE_PAGE_RANGE
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
