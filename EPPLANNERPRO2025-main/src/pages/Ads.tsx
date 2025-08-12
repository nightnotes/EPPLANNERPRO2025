
import Navbar from '../components/Navbar'
export default function Ads(){
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-semibold">Advertentiebeheer</h1>
        <div className="card p-6">
          <p className="mb-4 text-nn_muted">Ga naar Meta Ads manager.</p>
          <a className="btn-primary" href="https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=925502492631790&business_id=1588689962026120&nav_entry_point=ads_ecosystem_navigation_menu&date=2025-06-16_2025-06-17%2Ctoday&comparison_date&insights_date=2025-06-16_2025-06-17%2Ctoday&insights_comparison_date&selected_campaign_ids=120215182436970421&nav_source=no_referrer#" target="_blank" rel="noreferrer">Open Ads Manager</a>
        </div>
      </div>
    </div>
  )
}
