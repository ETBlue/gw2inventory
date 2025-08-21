import { Td, Tr, Image, Heading, Tag, Code, Badge, Box } from "@chakra-ui/react"
import { BsQuestionOctagonFill } from "react-icons/bs"

import { PatchedItem, UserItemInList } from "types/items"

import sharedTableCss from "~/styles/shared-table.module.css"
import sharedTextCss from "~/styles/shared-text.module.css"
interface Props {
  item: PatchedItem
  userItem: UserItemInList
  materialCategory?: string
}

function Item(props: Props) {
  const { item, userItem, materialCategory } = props
  return (
    <Tr>
      <Td className={sharedTableCss.iconCell}>
        {item ? (
          <Image
            src={item.icon}
            alt={item.rarity}
            className={`${sharedTableCss.icon} ${sharedTableCss[item.rarity.toLowerCase()]}`}
          />
        ) : (
          <BsQuestionOctagonFill size="3.5rem" />
        )}
      </Td>
      <Td className={sharedTableCss.nameCell}>
        {item ? (
          <>
            <Heading
              as="h4"
              size="sm"
              className={`${sharedTableCss.name} ${sharedTableCss[item?.rarity.toLowerCase()]}`}
            >
              {item.name}
            </Heading>
            {item.description && (
              <p
                className={`${sharedTableCss.description} ${sharedTextCss.secondary}`}
              >
                {item.description}
              </p>
            )}
            {item.details?.description && (
              <p
                className={`${sharedTableCss.description} ${sharedTextCss.secondary}`}
              >
                {item.details.description}
              </p>
            )}
            {item.details?.infix_upgrade && (
              <p
                className={`${sharedTableCss.description} ${sharedTextCss.secondary}`}
              >
                {item.details.infix_upgrade.attributes.map((attr) => (
                  <Box as="span" key={attr.attribute} marginRight="0.5rem">
                    <Tag size="sm">{attr.attribute}</Tag> {attr.modifier}
                  </Box>
                ))}
              </p>
            )}
            {"stats" in userItem && userItem.stats?.attributes && (
              <p
                className={`${sharedTableCss.description} ${sharedTextCss.secondary}`}
              >
                {Object.entries(userItem.stats.attributes).map(
                  ([attr, value]) => (
                    <Box key={attr} marginRight="0.5rem" as="span">
                      <Tag variant="outline" size="sm">
                        {attr}
                      </Tag>{" "}
                      {value}
                    </Box>
                  ),
                )}
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
          <div className={sharedTextCss.secondary}>{item?.details?.type}</div>
        )}
        {materialCategory && (
          <div className={sharedTextCss.secondary}>{materialCategory}</div>
        )}
      </Td>
      <Td maxWidth="6rem">
        {item && (
          <>
            {item.level}
            <div className={sharedTextCss.secondary}>
              {item && item.restrictions.join(",")}
            </div>
          </>
        )}
      </Td>
      <Td minWidth="12rem">
        {userItem.location}{" "}
        {"isEquipped" in userItem && userItem.isEquipped && (
          <Badge size="sm" fontWeight="normal">
            Equipped
          </Badge>
        )}
        {"bound_to" in userItem && userItem.bound_to && (
          <div className={sharedTextCss.secondary}>
            bound to {userItem.bound_to}
          </div>
        )}
      </Td>
      <Td maxWidth="6rem">{"count" in userItem && userItem.count}</Td>
      <Td maxWidth="10rem">
        {item && (
          <Code className={sharedTextCss.secondary}>{item.chat_link}</Code>
        )}
      </Td>
    </Tr>
  )
}

export default Item
