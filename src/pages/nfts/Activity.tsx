import React from "react";
import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { useEvents } from "../../hooks/useNFTs/useEvents";
import { Table, Text, Avatar, Flex, Box, Spinner, Badge } from "@radix-ui/themes";
import { Card as CardComponent } from "@/components/ui/card";

function Activity() {
  const { data: events, loading, error } = useEvents();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="3" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Text color="red">Error loading NFT activity: {error.message}</Text>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">NFT Activity</h1>
          <p className="text-muted-foreground">Recent NFT transactions and events</p>
        </div>

        <CardComponent>
          <div className="p-6">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Event</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>NFT</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>From</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>To</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {events?.map((event: any, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Badge color={event.type === 'sale' ? 'green' : 'blue'}>
                        {event.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Avatar
                          src={event.nft?.image_url}
                          fallback="NFT"
                          size="1"
                        />
                        <Text size="2">{event.nft?.name || 'Unknown NFT'}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="1" color="gray">
                        {event.from_address ? `${event.from_address.slice(0, 6)}...${event.from_address.slice(-4)}` : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="1" color="gray">
                        {event.to_address ? `${event.to_address.slice(0, 6)}...${event.to_address.slice(-4)}` : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text weight="medium">
                        {event.price ? `${event.price} SUI` : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="1" color="gray">
                        {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            {(!events || events.length === 0) && (
              <div className="text-center py-8">
                <Text color="gray">No NFT activity found</Text>
              </div>
            )}
          </div>
        </CardComponent>
      </div>
    </Layout>
  );
}

export default Activity;