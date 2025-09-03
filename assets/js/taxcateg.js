const firstLists = ["Companies Income Tax", "Withholding Tax on companies and residents of the Federal Capital Territory and non-resident individuals", "Petroleum Profit Tax", "Value Added Tax", "Education Tax", "Capital Gains Tax on the residents of the Federal Capital Territory, bodies corporate and non-resident individuals", "Stamp Duties on bodies corporate and residents of the Federal Capital Territory", "Personal Income Tax in respect of: (a)Members of the Armed Forces of the Federation (b)Members of the Nigerian Police Force (c)Residents of the Federal Capital Territory (d)Staff of the Ministry of Foreign Affairs and non-resident individuals", "National Information Technology Development Levy"]
firstLists.forEach(firstList => (
  $("#firstList").append(`
    <li class="mb-2 text-gray-600">${firstList}</li>
  `)
))

const secondList = ["Personal Income Tax in respect of individuals resident in the State (a)Pay-As-You-Earn(PAYE) (b)Direct Taxation(Self-Assessment)", "Withholding Tax (Individuals Only)", "Capital Gains Tax (Individuals Only)", "Stamp Duties on instrument executed by individuals", "Pool and Betting, Lotteries Gaming and Casino Taxes", "Road Taxes", "Business premises registration fee in respect of urban and rural areas which includes registration fees and per annum for the renewals as fixed by each state", "Development Levy (individuals only) not more than 100 per annum on all taxable individuals", "Naming of street registration fees in the State Capital", "Right of Occupancy fees on lands owned by the State Government in urban areas of the State", "Market Taxes and Levies where State finance is involved", "Land use Charge, where applicable", "Entertainment Tax, where applicable", "Environmental (Ecological) fee or levy", "Mining, milling and quarrying fee, where applicable", "Hotel, Restaurant or Event Centre Consumption Tax, where applicable", "Animal Trade Tax, where applicable", "Produce Sales Tax, where applicable", "Slaughter or Abattoir fees, where applicable", "Infrastructure Maintenance Charge or levy, where applicable", "Fire Service Charge", "Property Tax, where applicable", "Economic Development Levy, where applicable", "Social Services Contribution Levy, where applicable", "Signage and Mobile Advertisement, jointly collected by the State and Local Government"]

secondList.forEach(secondListt => (
  $("#secondList").append(`
    <li class="mb-2 text-gray-600">${secondListt}</li>
  `)
))

const thirdLists = ["Shops and Kiosks rates", "Tenement rates", "Slaughter slab fees", "Marriage, birth and death registration fees", "Naming of street registration fees, excluding any street in the State Capital", "Right of Occupancy fees on lands in the rural areas, excluding those collectible by the Federal and State Governments.", "Markets taxes and levies excluding any market where State finance is involved", "Motor park levies", "Domestic animal license fees", "Bicycle, truck canoe wheelbarrow and cart fees, other than a mechanically propelled truck", "Cattle tax payable by cattle farmers only", "Merriment and road closure", "Radio and television license fees (other than radio and television transmitter)", "Vehicle radio license", "Wrong parking charges", "Public convenience, sewage and refuse disposal fees.", "Customary burial grounds permit fees", "Religious places establishment permit fees.", "Signboard and Advertisement permit fees.", "Wharf Landing Charge, where applicable"]

thirdLists.forEach(thirdList => (
  $("#thirdList").append(`
    <li class="mb-2 text-gray-600">${thirdList}</li>
  `)
))