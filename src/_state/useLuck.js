import {useState, useEffect} from 'react'

import useAPI from '../_api/useAPI'

// luck definition

const MF_LUCK = [
  {mf: 0, luck: 0},
  {mf: 1, luck: 100},
  {mf: 2, luck: 200},
  {mf: 3, luck: 300},
  {mf: 4, luck: 400},
  {mf: 5, luck: 500},
  {mf: 6, luck: 600},
  {mf: 7, luck: 700},
  {mf: 8, luck: 800},
  {mf: 9, luck: 910},
  {mf: 10, luck: 1020},
  {mf: 11, luck: 1130},
  {mf: 12, luck: 1240},
  {mf: 13, luck: 1360},
  {mf: 14, luck: 1480},
  {mf: 15, luck: 1600},
  {mf: 16, luck: 1730},
  {mf: 17, luck: 1860},
  {mf: 18, luck: 2000},
  {mf: 19, luck: 2150},
  {mf: 20, luck: 2300},
  {mf: 21, luck: 2460},
  {mf: 22, luck: 2630},
  {mf: 23, luck: 2810},
  {mf: 24, luck: 3000},
  {mf: 25, luck: 3200},
  {mf: 26, luck: 3410},
  {mf: 27, luck: 3630},
  {mf: 28, luck: 3860},
  {mf: 29, luck: 4110},
  {mf: 30, luck: 4370},
  {mf: 31, luck: 4640},
  {mf: 32, luck: 4930},
  {mf: 33, luck: 5240},
  {mf: 34, luck: 5560},
  {mf: 35, luck: 5900},
  {mf: 36, luck: 6260},
  {mf: 37, luck: 6640},
  {mf: 38, luck: 7040},
  {mf: 39, luck: 7460},
  {mf: 40, luck: 7900},
  {mf: 41, luck: 8370},
  {mf: 42, luck: 8860},
  {mf: 43, luck: 9380},
  {mf: 44, luck: 9920},
  {mf: 45, luck: 10490},
  {mf: 46, luck: 11090},
  {mf: 47, luck: 11720},
  {mf: 48, luck: 12380},
  {mf: 49, luck: 13070},
  {mf: 50, luck: 13790},
  {mf: 51, luck: 14550},
  {mf: 52, luck: 15340},
  {mf: 53, luck: 16170},
  {mf: 54, luck: 17030},
  {mf: 55, luck: 17930},
  {mf: 56, luck: 18870},
  {mf: 57, luck: 19850},
  {mf: 58, luck: 20870},
  {mf: 59, luck: 21940},
  {mf: 60, luck: 23050},
  {mf: 61, luck: 24200},
  {mf: 62, luck: 25400},
  {mf: 63, luck: 26650},
  {mf: 64, luck: 27950},
  {mf: 65, luck: 29300},
  {mf: 66, luck: 30700},
  {mf: 67, luck: 32150},
  {mf: 68, luck: 33660},
  {mf: 69, luck: 35220},
  {mf: 70, luck: 36840},
  {mf: 71, luck: 38510},
  {mf: 72, luck: 40240},
  {mf: 73, luck: 42030},
  {mf: 74, luck: 43890},
  {mf: 75, luck: 45810},
  {mf: 76, luck: 47790},
  {mf: 77, luck: 49840},
  {mf: 78, luck: 51960},
  {mf: 79, luck: 54150},
  {mf: 80, luck: 56410},
  {mf: 81, luck: 58740},
  {mf: 82, luck: 61140},
  {mf: 83, luck: 63620},
  {mf: 84, luck: 66170},
  {mf: 85, luck: 68800},
  {mf: 86, luck: 71510},
  {mf: 87, luck: 74300},
  {mf: 88, luck: 77170},
  {mf: 89, luck: 80130},
  {mf: 90, luck: 83170},
  {mf: 91, luck: 86300},
  {mf: 92, luck: 89520},
  {mf: 93, luck: 92830},
  {mf: 94, luck: 96230},
  {mf: 95, luck: 99720},
  {mf: 96, luck: 103300},
  {mf: 97, luck: 106980},
  {mf: 98, luck: 110760},
  {mf: 99, luck: 114640},
  {mf: 100, luck: 118620},
  {mf: 101, luck: 122700},
  {mf: 102, luck: 126890},
  {mf: 103, luck: 131180},
  {mf: 104, luck: 135580},
  {mf: 105, luck: 140090},
  {mf: 106, luck: 144710},
  {mf: 107, luck: 149440},
  {mf: 108, luck: 154290},
  {mf: 109, luck: 159250},
  {mf: 110, luck: 164330},
  {mf: 111, luck: 169530},
  {mf: 112, luck: 174850},
  {mf: 113, luck: 180300},
  {mf: 114, luck: 185870},
  {mf: 115, luck: 191570},
  {mf: 116, luck: 197400},
  {mf: 117, luck: 203360},
  {mf: 118, luck: 209450},
  {mf: 119, luck: 215670},
  {mf: 120, luck: 222030},
  {mf: 121, luck: 228530},
  {mf: 122, luck: 235160},
  {mf: 123, luck: 241940},
  {mf: 124, luck: 248860},
  {mf: 125, luck: 255920},
  {mf: 126, luck: 263130},
  {mf: 127, luck: 270490},
  {mf: 128, luck: 278000},
  {mf: 129, luck: 285660},
  {mf: 130, luck: 293480},
  {mf: 131, luck: 301460},
  {mf: 132, luck: 309590},
  {mf: 133, luck: 317880},
  {mf: 134, luck: 326340},
  {mf: 135, luck: 334960},
  {mf: 136, luck: 343750},
  {mf: 137, luck: 352710},
  {mf: 138, luck: 361840},
  {mf: 139, luck: 371140},
  {mf: 140, luck: 380610},
  {mf: 141, luck: 390260},
  {mf: 142, luck: 400090},
  {mf: 143, luck: 410100},
  {mf: 144, luck: 420290},
  {mf: 145, luck: 430660},
  {mf: 146, luck: 441220},
  {mf: 147, luck: 451970},
  {mf: 148, luck: 462910},
  {mf: 149, luck: 474040},
  {mf: 150, luck: 485370},
  {mf: 151, luck: 496890},
  {mf: 152, luck: 508610},
  {mf: 153, luck: 520530},
  {mf: 154, luck: 532660},
  {mf: 155, luck: 544990},
  {mf: 156, luck: 557530},
  {mf: 157, luck: 570280},
  {mf: 158, luck: 583240},
  {mf: 159, luck: 596420},
  {mf: 160, luck: 609810},
  {mf: 161, luck: 623420},
  {mf: 162, luck: 637250},
  {mf: 163, luck: 651310},
  {mf: 164, luck: 665590},
  {mf: 165, luck: 680100},
  {mf: 166, luck: 694840},
  {mf: 167, luck: 709810},
  {mf: 168, luck: 725010},
  {mf: 169, luck: 740450},
  {mf: 170, luck: 756130},
  {mf: 171, luck: 772050},
  {mf: 172, luck: 788210},
  {mf: 173, luck: 804620},
  {mf: 174, luck: 821270},
  {mf: 175, luck: 838170},
  {mf: 176, luck: 855330},
  {mf: 177, luck: 872740},
  {mf: 178, luck: 890410},
  {mf: 179, luck: 908340},
  {mf: 180, luck: 926530},
  {mf: 181, luck: 944980},
  {mf: 182, luck: 963700},
  {mf: 183, luck: 982690},
  {mf: 184, luck: 1001950},
  {mf: 185, luck: 1021480},
  {mf: 186, luck: 1041290},
  {mf: 187, luck: 1061380},
  {mf: 188, luck: 1081750},
  {mf: 189, luck: 1102400},
  {mf: 190, luck: 1123340},
  {mf: 191, luck: 1144560},
  {mf: 192, luck: 1166070},
  {mf: 193, luck: 1187880},
  {mf: 194, luck: 1209980},
  {mf: 195, luck: 1232380},
  {mf: 196, luck: 1255080},
  {mf: 197, luck: 1278080},
  {mf: 198, luck: 1301390},
  {mf: 199, luck: 1325000},
  {mf: 200, luck: 1348920},
  {mf: 201, luck: 1373160},
  {mf: 202, luck: 1397710},
  {mf: 203, luck: 1422580},
  {mf: 204, luck: 1447770},
  {mf: 205, luck: 1473280},
  {mf: 206, luck: 1499120},
  {mf: 207, luck: 1525280},
  {mf: 208, luck: 1551780},
  {mf: 209, luck: 1578610},
  {mf: 210, luck: 1605770},
  {mf: 211, luck: 1633270},
  {mf: 212, luck: 1661110},
  {mf: 213, luck: 1689290},
  {mf: 214, luck: 1717820},
  {mf: 215, luck: 1746700},
  {mf: 216, luck: 1775930},
  {mf: 217, luck: 1805510},
  {mf: 218, luck: 1835450},
  {mf: 219, luck: 1865450},
  {mf: 220, luck: 1895450},
  {mf: 221, luck: 1925450},
  {mf: 222, luck: 1955450},
  {mf: 223, luck: 1985450},
  {mf: 224, luck: 2015450},
  {mf: 225, luck: 2045450},
  {mf: 226, luck: 2075450},
  {mf: 227, luck: 2105450},
  {mf: 228, luck: 2135450},
  {mf: 229, luck: 2165450},
  {mf: 230, luck: 2195450},
  {mf: 231, luck: 2225450},
  {mf: 232, luck: 2255450},
  {mf: 233, luck: 2285450},
  {mf: 234, luck: 2315450},
  {mf: 235, luck: 2345450},
  {mf: 236, luck: 2375450},
  {mf: 237, luck: 2405450},
  {mf: 238, luck: 2435450},
  {mf: 239, luck: 2465450},
  {mf: 240, luck: 2495450},
  {mf: 241, luck: 2525450},
  {mf: 242, luck: 2555450},
  {mf: 243, luck: 2585450},
  {mf: 244, luck: 2615450},
  {mf: 245, luck: 2645450},
  {mf: 246, luck: 2675450},
  {mf: 247, luck: 2705450},
  {mf: 248, luck: 2735450},
  {mf: 249, luck: 2765450},
  {mf: 250, luck: 2795450},
  {mf: 251, luck: 2825450},
  {mf: 252, luck: 2855450},
  {mf: 253, luck: 2885450},
  {mf: 254, luck: 2915450},
  {mf: 255, luck: 2945450},
  {mf: 256, luck: 2975450},
  {mf: 257, luck: 3005450},
  {mf: 258, luck: 3035450},
  {mf: 259, luck: 3065450},
  {mf: 260, luck: 3095450},
  {mf: 261, luck: 3125450},
  {mf: 262, luck: 3155450},
  {mf: 263, luck: 3185450},
  {mf: 264, luck: 3215450},
  {mf: 265, luck: 3245450},
  {mf: 266, luck: 3275450},
  {mf: 267, luck: 3305450},
  {mf: 268, luck: 3335450},
  {mf: 269, luck: 3365450},
  {mf: 270, luck: 3395450},
  {mf: 271, luck: 3425450},
  {mf: 272, luck: 3455450},
  {mf: 273, luck: 3485450},
  {mf: 274, luck: 3515450},
  {mf: 275, luck: 3545450},
  {mf: 276, luck: 3575450},
  {mf: 277, luck: 3605450},
  {mf: 278, luck: 3635450},
  {mf: 279, luck: 3665450},
  {mf: 280, luck: 3695450},
  {mf: 281, luck: 3725450},
  {mf: 282, luck: 3755450},
  {mf: 283, luck: 3785450},
  {mf: 284, luck: 3815450},
  {mf: 285, luck: 3845450},
  {mf: 286, luck: 3875450},
  {mf: 287, luck: 3905450},
  {mf: 288, luck: 3935450},
  {mf: 289, luck: 3965450},
  {mf: 290, luck: 3995450},
  {mf: 291, luck: 4025450},
  {mf: 292, luck: 4055450},
  {mf: 293, luck: 4085450},
  {mf: 294, luck: 4115450},
  {mf: 295, luck: 4145450},
  {mf: 296, luck: 4175450},
  {mf: 297, luck: 4205450},
  {mf: 298, luck: 4235450},
  {mf: 299, luck: 4265450},
  {mf: 300, luck: 4295450}
]

const search = (dictionary, luck) => {
  const length = dictionary.length
  if (length <= 2) {
    return dictionary[0].mf
  }

  const centralIndex = Math.floor((length - 1) / 2)

  const maxItem = dictionary[centralIndex + 1]
  const minItem = dictionary[centralIndex]

  if (luck === maxItem.luck) {
    return maxItem.mf
  } else if (luck >= minItem.luck && luck < maxItem.luck) {
    return minItem.mf
  }

  let newDictionary
  if (luck > maxItem.luck) {
    newDictionary = dictionary.slice(centralIndex + 1)
  } else if (luck < minItem.luck) {
    newDictionary = dictionary.slice(0, centralIndex)
  }
  return search(newDictionary, luck)
}

const getMF = (luck) => {
  return search([...MF_LUCK], luck)
}

// the hook

const useLuck = (token) => {
  // setup account luck

  const [luck, setLuck] = useState(undefined)

  const luckInfo = useAPI({
    endpoint: '/account/luck',
    token
  })

  // setup account mf

  const [magicFind, setMagicFind] = useState(undefined)

  // update account luck on token change

  useEffect(() => {
    if (!token) {
      return
    }

    luckInfo.call({
      done: (data) => {
        const luckValue = data[0].value
        setMagicFind(getMF(luckValue))
        setLuck(luckValue)
      }
    })
  }, [token])

  return {luck, magicFind}
}

export default useLuck
