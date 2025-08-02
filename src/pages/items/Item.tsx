import { Td, Tr, Image, Heading, Tag, Code, Badge, Box } from "@chakra-ui/react"
import { BsQuestionOctagonFill } from "react-icons/bs"

import { InfixUpgradeAttribute, Item as ItemDef } from "contexts/types/Item"
import { UserItemInList } from "contexts/types/ItemContext"

import css from "./styles/Item.module.css"

interface Props {
  item: ItemDef
  userItem: UserItemInList
  materialCategory?: string
}

function Item(props: Props) {
  const { item, userItem, materialCategory } = props
  return (
    <Tr>
      <Td className={css.iconCell}>
        {item ? (
          <Image
            src={item.icon}
            alt={item.rarity}
            className={`${css.icon} ${css[item.rarity.toLowerCase()]}`}
            border="5px yellow solid"
          />
        ) : (
          <BsQuestionOctagonFill size="3.5rem" />
        )}
      </Td>
      <Td className={css.nameCell}>
        {item ? (
          <>
            <Heading
              as="h4"
              size="sm"
              className={`${css.name} ${css[item?.rarity.toLowerCase()]}`}
            >
              {item.name}
            </Heading>
            {item.description && (
              <p className={`${css.description} ${css.secondary}`}>
                {item.description}
              </p>
            )}
            {item.details?.description && (
              <p className={`${css.description} ${css.secondary}`}>
                {item.details.description}
              </p>
            )}
            {item.details?.infix_upgrade && (
              <p className={`${css.description} ${css.secondary}`}>
                {item.details.infix_upgrade.attributes.map(
                  (attr: InfixUpgradeAttribute) => (
                    <Box as="span" key={attr.attribute} marginRight="0.5rem">
                      <Tag size="sm">{attr.attribute}</Tag> {attr.modifier}
                    </Box>
                  ),
                )}
              </p>
            )}
            {userItem.stats && (
              <p className={`${css.description} ${css.secondary}`}>
                {Object.keys(userItem.stats.attributes).map((attr) => (
                  <Box key={attr} marginRight="0.5rem" as="span">
                    <Tag variant="outline" size="sm">
                      {attr}
                    </Tag>{" "}
                    {userItem.stats.attributes[attr]}
                  </Box>
                ))}
              </p>
            )}
          </>
        ) : (
          <>
            Item not exists in Guild Wars 2 API. ID: <Code>{userItem.id}</Code>
          </>
        )}
      </Td>
      <Td maxWidth="12rem">
        {item?.type}
        {item?.details?.type && (
          <div className={css.secondary}>{item?.details?.type}</div>
        )}
        {materialCategory && (
          <div className={css.secondary}>{materialCategory}</div>
        )}
      </Td>
      <Td maxWidth="6rem">
        {item && (
          <>
            {item.level}
            <div className={css.secondary}>
              {item && item.restrictions.join(",")}
            </div>
          </>
        )}
      </Td>
      <Td minWidth="12rem">
        {userItem.location}{" "}
        {userItem.isEquipped && (
          <Badge size="sm" fontWeight="normal">
            Equipped
          </Badge>
        )}
        {userItem.bound_to && (
          <div className={css.secondary}>bound to {userItem.bound_to}</div>
        )}
      </Td>
      <Td maxWidth="6rem">{userItem?.count}</Td>
      <Td maxWidth="10rem">
        {item && <Code className={css.secondary}>{item.chat_link}</Code>}
      </Td>
    </Tr>
  )
}

export default Item
