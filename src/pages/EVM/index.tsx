import { Allotment, AllotmentHandle, LayoutPriority } from 'allotment'
import { BookText, Folders } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMTabStore } from '@/store/tabs'

import Collections from './Collections'
import ContractRequest from './ContractRequest'
import DocumentContent from './Documentation/DocumentContent'
import DocumentList from './Documentation/DocumentList'
import Welcome from './Welcome'
import Toolbar from './Toolbar'

export default function EVM() {
  const toolbarRef = useRef<AllotmentHandle>(null)

  const { tabs } = useEVMTabStore()
  const { setChains } = useEVMChainsStore()

  const handleToolbarChange = (sizes: number[]) => {
    if (sizes?.[1] > 48 && sizes?.[1] < 384) {
      toolbarRef.current?.resize([sizes?.[0], 384])
    }
  }

  useEffect(() => {
    const fetchChains = async () => {
      const res = await fetch('https://chainid.network/chains.json')
      const chains = await res.json()
      setChains([
        {
          name: 'Ronin Mainnet',
          title: 'Ronin mainnet',
          chain: 'Ronin',
          rpc: ['https://api.roninchain.com/rpc'],
          faucets: [],
          nativeCurrency: {
            name: 'RON',
            symbol: 'RON',
            decimals: 18,
          },
          infoURL: 'https://app.roninchain.com',
          shortName: 'Ronin',
          chainId: 2020,
          networkId: 2020,
          slip44: 1,
          explorers: [
            {
              name: 'Ronin mainnet explorer',
              url: 'https://app.roninchain.com',
              standard: 'none',
            },
          ],
        },
        {
          name: 'Ronin Testnet',
          title: 'Ronin testnet',
          chain: 'Saigon Testnet',
          rpc: ['https://saigon-testnet.roninchain.com/rpc'],
          faucets: ['https://faucet.roninchain.com/'],
          nativeCurrency: {
            name: 'RON',
            symbol: 'RON',
            decimals: 18,
          },
          infoURL: 'https://saigon-app.roninchain.com',
          shortName: 'Ronin',
          chainId: 2021,
          networkId: 2021,
          slip44: 1,
          explorers: [
            {
              name: 'Ronin testnet explorer',
              url: 'https://saigon-app.roninchain.com',
              standard: 'none',
            },
          ],
        },
        ...chains,
      ])
    }
    fetchChains()
  }, [setChains])

  const displayContractRequest = useMemo(() => {
    if (tabs.length > 0) return <ContractRequest />
    return <Welcome />
  }, [tabs])

  return (
    <Tabs defaultValue="collections" orientation="vertical" className="w-full h-full">
      <Allotment proportionalLayout={false}>
        <Allotment.Pane minSize={256} maxSize={376} preferredSize={320} priority={LayoutPriority.High} snap>
          <Allotment>
            <Allotment.Pane minSize={48} maxSize={48}>
              <TooltipProvider>
                <TabsList className="gap-2 p-2 bg-inherit">
                  <Tooltip>
                    <TabsTrigger
                      value="collections"
                      className="data-[state=active]:text-primary data-[state=active]:shadow-none"
                      asChild
                    >
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="h-auto p-2">
                          <Folders className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                    </TabsTrigger>
                    <TooltipContent side="right">
                      <p>Collections</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TabsTrigger
                      value="docs"
                      className="data-[state=active]:text-primary data-[state=active]:shadow-none"
                      asChild
                    >
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="h-auto p-2">
                          <BookText className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                    </TabsTrigger>
                    <TooltipContent side="right">
                      <p>Documentation</p>
                    </TooltipContent>
                  </Tooltip>
                </TabsList>
              </TooltipProvider>
            </Allotment.Pane>
            <Allotment.Pane>
              <TabsContent value="collections" className="w-full h-full m-0">
                <Collections />
              </TabsContent>
              <TabsContent value="docs" className="w-full h-full m-0">
                <DocumentList />
              </TabsContent>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane priority={LayoutPriority.Low}>
          <TabsContent value="collections" className="w-full h-full m-0">
            <Allotment ref={toolbarRef} onChange={handleToolbarChange} proportionalLayout={false}>
              <Allotment.Pane priority={LayoutPriority.High}>{displayContractRequest}</Allotment.Pane>
              <Allotment.Pane minSize={48} maxSize={448} preferredSize={48} priority={LayoutPriority.Low}>
                <Toolbar toolbarRef={toolbarRef} />
              </Allotment.Pane>
            </Allotment>
          </TabsContent>
          <TabsContent value="docs" className="w-full h-full m-0">
            <DocumentContent />
          </TabsContent>
        </Allotment.Pane>
      </Allotment>
    </Tabs>
  )
}
