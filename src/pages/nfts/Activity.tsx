import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { useEvents } from "../../hooks/useNFTs/useEvents";
import {
  Table,
  Text,
  Avatar,
  Flex,
  Box,
  Spinner,
  Badge,
} from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function Activity() {
  const { nftevents, loading, error } = useEvents();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              NFTs - NFT Activity
            </h2>
            <p className="text-[#292929] mt-1">
              Transfers, listings, and sales activity.
            </p>
          </CardComponent>
          <div className="flex justify-center items-center py-12">
            <Spinner size="3" />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            NFTs - NFT Activity
          </h2>
          <p className="text-[#292929] mt-1">
            Transfers, listings, and sales activity.
          </p>
        </CardComponent>

        {/* NFT Activity Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Recent NFT Activity
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px] overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Event
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  NFT
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Price (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Buyer
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Seller
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Marketplace
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Time
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Transaction
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {nftevents.map((event, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Badge
                      color={
                        event.eventType === "Sale"
                          ? "green"
                          : event.eventType === "List"
                            ? "blue"
                            : "orange"
                      }
                      variant="soft"
                    >
                      {event.eventType}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar
                        src={event.nftImg}
                        fallback={event.nftName?.[0] || "N"}
                        size="2"
                      />
                      <Box>
                        <Text weight="medium" className="text-[#292929]">
                          {event.nftName || "Unnamed NFT"}
                        </Text>
                        <Text size="1" className="text-[#292929]">
                          {event.nftId
                            ? `${event.nftId.slice(0, 8)}...${event.nftId.slice(-6)}`
                            : "Unknown ID"}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {event.latestPrice
                        ? `${event.latestPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} SUI`
                        : event.bidPrice
                          ? `${event.bidPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} SUI (Bid)`
                          : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {event.buyerAddress ? (
                      <Flex align="center" gap="2">
                        <Avatar
                          src={event.buyerImg}
                          fallback={event.buyerName?.[0] || "B"}
                          size="1"
                        />
                        <Box>
                          <Text size="2" className="text-[#292929]">
                            {event.buyerName || "Unknown"}
                          </Text>
                          <Text size="1" className="text-[#292929]">
                            {`${event.buyerAddress.slice(0, 6)}...${event.buyerAddress.slice(-4)}`}
                          </Text>
                        </Box>
                      </Flex>
                    ) : (
                      <Text size="2" className="text-[#292929]">
                        N/A
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {event.sellerAddress ? (
                      <Flex align="center" gap="2">
                        <Avatar
                          src={event.sellerImg}
                          fallback={event.sellerName?.[0] || "S"}
                          size="1"
                        />
                        <Box>
                          <Text size="2" className="text-[#292929]">
                            {event.sellerName || "Unknown"}
                          </Text>
                          <Text size="1" className="text-[#292929]">
                            {`${event.sellerAddress.slice(0, 6)}...${event.sellerAddress.slice(-4)}`}
                          </Text>
                        </Box>
                      </Flex>
                    ) : (
                      <Text size="2" className="text-[#292929]">
                        N/A
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {event.marketplace || "Unknown"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929]">
                      {event.timestamp
                        ? new Date(event.timestamp).toLocaleString()
                        : "Unknown"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="1" className="text-[#292929]">
                      {event.txHash
                        ? `${event.txHash.slice(0, 8)}...${event.txHash.slice(-6)}`
                        : "Unknown"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>
      </main>
    </Layout>
  );
}

export default Activity;
