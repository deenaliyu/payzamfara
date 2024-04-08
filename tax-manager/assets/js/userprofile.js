let userDATA = JSON.parse(localStorage.getItem("taxManagerDataPrime"))
let lgaList = {
  Abia: [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "muahia South",
    "Umu Nneochi"
  ],
  Adamawa: [
    "Demsa",
    "Fufure",
    "Ganye",
    "Gayuk",
    "Gombi",
    "Grie",
    "Hong",
    "Jada",
    "Larmurde",
    "Madagali",
    "Maiha",
    "Mayo Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South"
  ],
  AkwaIbom: [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo Asutan",
    "Ibiono-Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat-Enin",
    "Nsit-Atai",
    "Nsit-Ibom",
    "Nsit-Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung-Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong Oruko",
    "Uyo"
  ],
  Anambra: [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili South",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi"
  ],

  Bauchi: [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Gamawa",
    "Ganjuwa",
    "Giade",
    "Itas-Gadau",
    "Jama are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa Balewa",
    " Toro",
    " Warji",
    " Zaki"
  ],

  Bayelsa: [
    "Brass",
    "Ekeremor",
    "Kolokuma Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Ijaw",
    "Yenagoa"
  ],
  Benue: [
    "Agatu",
    "Apa",
    "Ado",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Ohimini",
    "Oju",
    "Okpokwu",
    "Oturkpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya"
  ],
  Borno: [
    "Abadam",
    "Askira-Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala-Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani"
  ],
  "Cross River": [
    "Abi",
    "Akamkpa",
    "Akpabuyo",
    "Bakassi",
    "Bekwarra",
    "Biase",
    "Boki",
    "Calabar Municipal",
    "Calabar South",
    "Etung",
    "Ikom",
    "Obanliku",
    "Obubra",
    "Obudu",
    "Odukpani",
    "Ogoja",
    "Yakuur",
    "Yala"
  ],

  Delta: [
    "Aniocha North",
    "Aniocha South",
    "Bomadi",
    "Burutu",
    "Ethiope East",
    "Ethiope West",
    "Ika North East",
    "Ika South",
    "Isoko North",
    "Isoko South",
    "Ndokwa East",
    "Ndokwa West",
    "Okpe",
    "Oshimili North",
    "Oshimili South",
    "Patani",
    "Sapele",
    "Udu",
    "Ughelli North",
    "Ughelli South",
    "Ukwuani",
    "Uvwie",
    "Warri North",
    "Warri South",
    "Warri South West"
  ],

  Ebonyi: [
    "Abakaliki",
    "Afikpo North",
    "Afikpo South",
    "Ebonyi",
    "Ezza North",
    "Ezza South",
    "Ikwo",
    "Ishielu",
    "Ivo",
    "Izzi",
    "Ohaozara",
    "Ohaukwu",
    "Onicha"
  ],
  Edo: [
    "Akoko-Edo",
    "Egor",
    "Esan Central",
    "Esan North-East",
    "Esan South-East",
    "Esan West",
    "Etsako Central",
    "Etsako East",
    "Etsako West",
    "Igueben",
    "Ikpoba Okha",
    "Orhionmwon",
    "Oredo",
    "Ovia North-East",
    "Ovia South-West",
    "Owan East",
    "Owan West",
    "Uhunmwonde"
  ],

  Ekiti: [
    "Ado Ekiti",
    "Efon",
    "Ekiti East",
    "Ekiti South-West",
    "Ekiti West",
    "Emure",
    "Gbonyin",
    "Ido Osi",
    "Ijero",
    "Ikere",
    "Ikole",
    "Ilejemeje",
    "Irepodun-Ifelodun",
    "Ise-Orun",
    "Moba",
    "Oye"
  ],
  Enugu: [
    "Aninri",
    "Awgu",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Etiti",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Oji River",
    "Udenu",
    "Udi",
    "Uzo Uwani"
  ],
  FCT: [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council"
  ],
  Gombe: [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Funakaye",
    "Gombe",
    "Kaltungo",
    "Kwami",
    "Nafada",
    "Shongom",
    "Yamaltu-Deba"
  ],
  Imo: [
    "Aboh Mbaise",
    "Ahiazu Mbaise",
    "Ehime Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte-Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Ngor Okpala",
    "Njaba",
    "Nkwerre",
    "Nwangele",
    "Obowo",
    "Oguta",
    "Ohaji-Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri Municipal",
    "Owerri North",
    "Owerri West",
    "Unuimo"
  ],
  Jigawa: [
    "Auyo",
    "Babura",
    "Biriniwa",
    "Birnin Kudu",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kazaure",
    "Kiri Kasama",
    "Kiyawa",
    "Kaugama",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule Tankarkar",
    "Taura",
    "Yankwashi"
  ],
  Kaduna: [
    "Birnin Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "Jaba",
    "Jema a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon Gari",
    "Sanga",
    "Soba",
    "Zangon Kataf",
    "Zaria"
  ],
  Kano: [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garun Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "Kumbotso",
    "Kunchi",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takai",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil"
  ],
  Katsina: [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango"
  ],
  Kebbi: [
    "Aleiro",
    "Arewa Dandi",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu Danko",
    "Yauri",
    "Zuru"
  ],
  Kogi: [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela Odolu",
    "Ijumu",
    "Kabba Bunu",
    "Kogi",
    "Lokoja",
    "Mopa Muro",
    "Ofu",
    "Ogori Magongo",
    "Okehi",
    "Okene",
    "Olamaboro",
    "Omala",
    "Yagba East",
    "Yagba West"
  ],
  Kwara: [
    "Asa",
    "Baruten",
    "Edu",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin South",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke Ero",
    "Oyun",
    "Pategi"
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
  ],
  Nasarawa: [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Kokona",
    "Lafia",
    "Nasarawa",
    "Nasarawa Egon",
    "Obi",
    "Toto",
    "Wamba"
  ],
  Niger: [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Moya",
    "Paikoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi"
  ],
  Ogun: [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo Ota",
    "Egbado North",
    "Egbado South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko Afon",
    "Ipokia",
    "Obafemi Owode",
    "Odeda",
    "Odogbolu",
    "Ogun Waterside",
    "Remo North",
    "Shagamu"
  ],
  Ondo: [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-West",
    "Akoko South-East",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji-Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo"
  ],
  Osun: [
    "Atakunmosa East",
    "Atakunmosa West",
    "Aiyedaade",
    "Aiyedire",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Egbedore",
    "Ejigbo",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesa East",
    "Ilesa West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo Otin",
    "Ola Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo"
  ],
  Oyo: [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan North",
    "Ibadan North-East",
    "Ibadan North-West",
    "Ibadan South-East",
    "Ibadan South-West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu",
    "Ogbomosho North",
    "Ogbomosho South",
    "Ogo Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona Ara",
    "Orelope",
    "Ori Ire",
    "Oyo",
    "Oyo East",
    "Saki East",
    "Saki West",
    "Surulere"
  ],
  Plateau: [
    "Bokkos",
    "Barkin Ladi",
    "Bassa",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang South",
    "Langtang North",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua an Pan",
    "Riyom",
    "Shendam",
    "Wase"
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Okrika",
    "Ogu–Bolo",
    "Eleme",
    "Tai",
    "Gokana",
    "Khana",
    "Oyigbo",
    "Opobo–Nkoro",
    "Andoni",
    "Bonny",
    "Degema",
    "Asari-Toru",
    "Akuku-Toru",
    "Abua–Odual",
    "Ahoada West",
    "Ahoada East",
    "Ogba–Egbema–Ndoni",
    "Emohua",
    "Ikwerre",
    "Etche",
    "Omuma"
  ],
  Sokoto: [
    "Binji",
    "Bodinga",
    "Dange Shuni",
    "Gada",
    "Goronyo",
    "Gudu",
    "Gwadabawa",
    "Illela",
    "Isa",
    "Kebbe",
    "Kware",
    "Rabah",
    "Sabon Birni",
    "Shagari",
    "Silame",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tangaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo"
  ],
  Taraba: [
    "Ardo Kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Gassol",
    "Ibi",
    "Jalingo",
    "Karim Lamido",
    "Kumi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing"
  ],
  Yobe: [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Machina",
    "Nangere",
    "Nguru",
    "Potiskum",
    "Tarmuwa",
    "Yunusari",
    "Yusufari"
  ],
  Zamfara: [
    "Anka",
    "Bakura",
    "Birnin Magaji Kiyaw",
    "Bukkuyum",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Chafe",
    "Zurmi"
  ]
}

function Profile() {
  let userInfo = JSON.parse(window.localStorage.getItem("taxManagerDataPrime"));

  $(".mainInfo").html(`
    <h4 class="text-[18px] text-[#2E2F5B]">${userInfo.office_name}</h4>
    <p class="text-[14px] text-[#667085] pt-2">Zone: ${userInfo.office_type}</p>
  `)

  $(".contactInfo").html(`
    <div class="flex justify-between md:w-[550px]">
      <label class="w-[195px]">Email</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.email}"
          maxlength="15" />
      </div>
    </div>
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">Phone number</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.contact}"
          maxlength="15" />
      </div>
    </div>
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">State</label>
      <select class="form-select mt-1 regInputs md:w-[454px]" id="selectState" data-name="state" required>
        <option value="Zamfara">Zamfara</option>
      </select>
    </div>
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">Local Government<br> Area</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1 regInputs" readonly type="text" value="${userInfo.lga}" />
      </div>
    </div>
    <div class="flex justify-between md:w-[550px] mt-2 items-center">
      <label class="w-[195px]">Address</label>
      <div class="form-group md:w-[454px] w-full">
        <input class="form-control mt-1" readonly type="text" value="${userInfo.address}" />
      </div>
    </div>
  `)

  let profilo = ""


  profilo += `



    <div class="flex justify-between mt-2">
      <label class="w-4/12">Email</label>
      <div class="form-group w-8/12">
        <input class="form-control mt-1 updtProf" data-name="email" type="text" value="${userInfo.email}" />
      </div>
    </div>

    <div class="flex justify-between mt-2 items-center">
      <label class="w-4/12">Phone number</label>
      <div class="form-group w-8/12">
        <input class="form-control mt-1 updtProf" data-name="contact" type="text" value="${userInfo.contact}" maxlength="15" />
      </div>
    </div>

    <div class="flex justify-between mt-2 items-center">
      <label class="w-4/12">State</label>
      <select class="form-select mt-1 w-8/12 updtProf" id="selectState" data-name="state" required>
        <option value="Zamfara">Zamfara</option>
      </select>
    </div>

    <div class="flex justify-between mt-2 items-center">
      <label class="w-4/12">Local Government Area</label>
      <select class="form-select mt-1 w-8/12 updtProf" id="selectLGA" data-name="lga" required>

      </select>
    </div>

    <div class="flex justify-between mt-2 items-center">
      <label class="w-4/12">Address</label>
      <div class="form-group w-8/12">
        <input class="form-control mt-1 updtProf" data-name="address" type="text" value="${userInfo.address}" />
      </div>
    </div>
  `

  $("#updtProfile").html(profilo)

  let stateSelect = document.querySelector("#selectState")
  let lgaSelect = document.querySelector('#selectLGA')
  lgaList["AkwaIbom"].forEach(stst => {
    lgaSelect.innerHTML += `
      <option value="${stst}">${stst}</option>
    `
  })


}

Profile()

$("#updateProfile").on("click", function (e) {
  e.preventDefault()

  let allInputs = document.querySelectorAll(".updtProf")
  $("#msg_box").html(`
      <div class="flex justify-center items-center mt-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    `)
  $("#updateProfile").addClass("hidden")

  let obj = {
    endpoint: "updateTaxOffices",
    data: {
      "id": userDATA.tax_office_id,
      ...userDATA
    }

  }
  delete obj.id;
  delete obj.time_in

  allInputs.forEach(allInput => {
    if (allInput.value === "") {

    } else {
      obj.data[allInput.dataset.name] = allInput.value
    }

  })
  // console.log(obj)

  $.ajax({
    type: "POST",
    url: HOST,
    dataType: 'json',
    data: JSON.stringify(obj),
    success: function (data) {
      console.log(data)
      if (data.status === 2) {
        $("#msg_box").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `)
        $("#updateProfile").removeClass("hidden")

      } else if (data.status === 1) {
        $("#msg_box").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message} please Log In Again.</p>
        `)
        localStorage.removeItem("taxManagerDataPrime")

        setTimeout(() => {
          window.location.href = "./index.html"
        }, 1000);

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_box").html(`
        <p class="text-danger text-center mt-4 text-lg">An error occured !</p>
      `)
      $("#updateProfile").removeClass("hidden")
    }
  });

})

let userDetails
async function fetchUserDetails() {
  const response = await fetch(`${HOST}?getSingleTaxOffice&id=${userDATA.tax_office_id}`)
  const userPrf = await response.json()

  // console.log(userPrf.user)
  userDetails = userPrf.message[0]

  // $("#theProfImg").attr("src", userPrf.user.img)
  // $("#theProfImg2").attr("src", userPrf.user.img)
}

fetchUserDetails()

function showPass(pos) {
  let AllF = document.querySelectorAll(".passinput")

  if (AllF[pos].type === "password") {

    AllF[pos].type = "text"

  } else {
    AllF[pos].type = "password"
  }
}

$("#updatePass").on("click", function (e) {

  let oldPass = document.querySelector("#oldPass").value
  let passField = document.querySelector("#newPass").value
  let confirmField = document.querySelector("#newPass2").value

  $("#msg_box2").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#updatePass").addClass("hidden")

  console.log(oldPass, userDetails)
  if (oldPass === "" || passField === "" || confirmField === "") {

    $("#msg_box2").html(`
      <p class="text-danger text-center">Fields can't be empty!</p>
    `)
    $("#updatePass").removeClass("hidden")

  } else if (oldPass !== userDetails.password) {

    $("#msg_box2").html(`
      <p class="text-danger text-center">Current password not correct !</p>
    `)
    $("#updatePass").removeClass("hidden")

  } else if (passField !== confirmField) {

    $("#msg_box2").html(`
      <p class="text-danger text-center">Confirm password didn't match password!</p>
    `)
    $("#updatePass").removeClass("hidden")

  } else {

    $.ajax({
      type: "GET",
      url: `${HOST}?updatePassTaxOfficer&id=${userDATA.tax_office_id}&password=${passField}`,
      dataType: 'json',
      success: function (data) {
        console.log(data)
        if (data.status === 2) {
          // $("#msg_box").html(`
          //   <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
          // `)
          // $("#updateProfile").removeClass("hidden")

        } else if (data.status === 1) {
          $("#msg_box2").html(`
            <p class="text-success text-center mt-4 text-lg">Password changed successfully !</p>
          `)


          setTimeout(() => {
            localStorage.removeItem('taxManagerDataPrime');
            window.location.href = "./index.html"

          }, 1000);

        }
      },
      error: function (request, error) {
        console.log(error);
        $("#msg_box2").html(`
          <p class="text-danger text-center mt-4 text-lg">Something went wrong !</p>
        `)
        $("#updatePass").removeClass("hidden")
      }
    });


  }


})

$("#openUpload").on("click", function (e) {
  document.querySelector("#profile_picIn").click()
})

let input = document.querySelector("#profile_picIn")
let preview = document.querySelector("#preview")
let thePicUrl = ""

function profileChanged() {

  $("#proffer").removeClass("hidden")

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      preview.src = reader.result;
      thePicUrl = reader.result
    };
  }
}

$("#updatePic").on("click", function () {
  let obj = {
    "endpoint": "updatePixTaxManager",
    "data": {
      "id": userDATA.tax_office_id,
      "img": thePicUrl
    }

  }

  $("#msg_center").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `)
  $("#updatePic").addClass("hidden")
  $.ajax({
    type: "POST",
    url: HOST,
    data: JSON.stringify(obj),
    dataType: 'json',
    success: function (data) {
      console.log(data)
      if (data.status === 1) {

        document.querySelector("#theProfImg").src = thePicUrl

        let storedData = JSON.parse(localStorage.getItem("userDataPrime"))
        storedData.img = thePicUrl
        localStorage.setItem("userDataPrime", JSON.stringify(storedData))

        $("#msg_center").html(`
          <p class="text-success">Picture updated successfully !</p>
        `)

        setTimeout(() => {
          $("#proffer").addClass("hidden")
          $("#msg_center").html(``)
          $("#updatePic").removeClass("hidden")
        }, 1000);

        setTimeout(() => {
          window.location.reload()
        }, 2000);


      } else {
        $("#msg_center").html(`
          <p class="text-danger">Network Error, Try again</p>
        `)
        $("#updatePic").removeClass("hidden")

      }
    },
    error: function (request, error) {
      console.log(error);
      $("#msg_center").html(`
        <p class="text-danger">something went wrong ! Try again</p>
      `)
      $("#updatePic").removeClass("hidden")
    }
  });
})