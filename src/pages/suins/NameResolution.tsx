import React, { useState } from "react";
import { AppLayout as Layout } from "../../components/layout/AppLayout";
import { useSuins } from "../../hooks/useSuins/useSuins";
import { TextField, Button, Flex, Text } from "@radix-ui/themes";
import { Card as CardComponent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

function NameResolution() {
  const { nameRecord, loading, error, fetchName } = useSuins();
  const [copied, setCopied] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      fetchName(input.trim());
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            SuiNS - Name Resolution
          </h2>
          <p className="text-[#292929] mt-1">
            Resolve human-readable names to blockchain addresses.
          </p>
        </CardComponent>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <Flex gap="3" align="center">
            <TextField.Root
              placeholder="Enter a SuiNS name (e.g. Adeniyi.sui)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Resolving..." : "Resolve"}
            </Button>
          </Flex>
        </form>

        {/* Result */}
        {error && (
          <CardComponent>
            <Text color="red" weight="bold">
              ⚠ Error: {error.message}
            </Text>
          </CardComponent>
        )}

        {nameRecord && (
          <CardComponent>
            <Text size="4" weight="bold" className="text-[#292929]">
              {nameRecord.name}
            </Text>

            <Flex direction="column" gap="3">
              {/* Target Address */}
              <Flex justify="between" align="center">
                <Text className="text-[#292929]">Target Address:</Text>
                <Flex align="center" gap="2" className="max-w-[65%] truncate">
                  <Text color="green" weight="medium" className="truncate">
                    {nameRecord.targetAddress}
                  </Text>
                  <button
                    onClick={() => handleCopy(nameRecord.targetAddress)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {copied === nameRecord.targetAddress ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#292929]" />
                    )}
                  </button>
                </Flex>
              </Flex>

              {/* Expiration */}
              <Flex justify="between">
                <Text className="text-[#292929]">Expiration:</Text>
                <Text color="yellow">
                  {new Date(
                    Number(nameRecord.expirationTimestampMs),
                  ).toLocaleString()}
                </Text>
              </Flex>

              {/* Walrus Site ID */}
              {nameRecord.data?.walrus_site_id && (
                <Flex justify="between" align="center">
                  <Text className="text-[#292929]">Walrus Site ID:</Text>
                  <Flex align="center" gap="2" className="max-w-[65%] truncate">
                    <Text color="purple" className="truncate">
                      {nameRecord.data.walrus_site_id}
                    </Text>
                    <button
                      onClick={() => handleCopy(nameRecord.data.walrus_site_id)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      {copied === nameRecord.data.walrus_site_id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#292929]" />
                      )}
                    </button>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </CardComponent>
        )}
      </main>
    </Layout>
  );
}

export default NameResolution;
