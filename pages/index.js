import React, { useEffect } from 'react'
import factory from '../ethereum/factory'
import Layout from '../components/Layout'
import EnhancedCards from '../components/EnhancedCards'
import { Button } from 'semantic-ui-react'

function Index({ campaigns }) {
  function renderCampaigns() {
    const items = campaigns.map((campaign) => ({
      header: campaign,
      description: <a>View Campaign</a>,
      fluid: true,
    }))

    return <EnhancedCards items={items} />
  }

  return (
    <Layout>
      <div>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
        <h3>Open Campaigns</h3>
        {renderCampaigns()}
        <Button content="Create Campaign" icon="add circle" primary />
      </div>
    </Layout>
  )
}

Index.getInitialProps = async (ctx) => {
  const campaigns = await factory.methods.getDeployedCampaigns().call()

  return { campaigns }
}

export default Index
