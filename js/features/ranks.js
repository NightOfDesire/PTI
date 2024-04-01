const RANKS = {
    names: ['rank','tier'],
    fullNames: ['Rank','Tier'],
    reset(type) {
        if (tmp.ranks[type].can) {
            player.ranks[type] = player.ranks[type].add(1)
            let reset = true
           
            if (reset) this.doReset[type]()
            updateRanksTemp()

           
        }
    },
    reqs: {
        rank(x=player.ranks.rank) {
            let base = E(2.5e5)
            let inc = E(10)
            inc = inc.pow(x.div(20).add(1))
            inc = inc.softcap(50, 0.9, 0)
            

            let req = Decimal.mul(base, Decimal.pow(inc, x)).scale("e15",1.01,0)

            return req
        },
        /***@param nil */
        tier(x=player.ranks.tier) {
            let base = 10
            let inc = 1.2
            inc = inc.pow(x.div(18).add(1))
            inc = inc.softcap(1.4, 0.75, 0)
            
            let req = Decimal.mul(bade, Decimal.pow(inc, x))

            return req
        }
    },
    unl: {
       tier() { return false}
    },
    doReset: {
        rank() {
            player.pts = E(0)
            for (let x = 1; x <= 3; x++) BUILDINGS.reset("points_"+x)
        },
        tier() {
            player.ranks.rank = E(0)
            this.rank()
        }
    },

    autoSwitch(rn) { player.auto_ranks[rn] = !player.auto_ranks[rn] },
    autoUnl: {
        rank() { return player.ranks.tier.gte(1) },
        tier() { return false}
       
    },
    desc: {
        rank: {
            '1': "unlock point upgrade 2.",
            '2': "gain x3 points",
            '3': "points are boosted by ((x+1)^2)^0.8, where x is your rank.",
            '4': "first point upgrade's base is increased by itself (x/20)"
        },
        tier: {
            '1': "unlock auto rank"
        }
    },
    effect: {
        rank: {
           '3'() {
            let ret = player.ranks.rank.add(1).pow(2).pow(0.8)

            return ret
           },
           '4'() {
            let ret = player.build.points_1.div(20)

            return ret
           }
      
        },
        tier: {

        }
    },
    effDesc: {
        rank: {
            3(x) { return formatMult(x) },
           
        },
        tier: {

        }
    }
}

const RTNS = [
    ['','Rank','Tier','Tetr','Pent','Hex','Hept','Oct','Enne'],
    ['','dec','icos'], // d>2 -> cont
    ['','hect'], // h>1 -> ct
]

const RTNS2 = [
    ['','un','do','tri','tetra','penta','hexa','hepta','octa','nona'], // d < 3
    ['','un','du','tria','tetra','penta','hexa','hepta','octa','nona'],
    ['','un','di','tri','tetra','penta','hexa','hepta','octa','nona'], // h
]

function getRankTierName(i) {
    if (Decimal.gte(i,999)) return '['+format(i)+']'
    else {
        i = Number(i)

        if (i < 9) return RTNS[0][i]
        i += 1
        let m = ''
        let h = Math.floor(i / 100), d = Math.floor(i / 10) % 10, o = i % 10

        if (d > 1 && o == 1) m += 'hen' 
        else if (d == 2 && o == 3) m += 'tr' 
        else m += RTNS2[0][o]
        if (d > 2) m += RTNS2[1][d] + 'cont'
        else m += RTNS[1][d]
        if (h > 0 && d > 0) m += 'a'
        if (h > 0) m += (h > 1 ? RTNS2[2][h] + 'ct' : 'hect')

        return capitalFirst(m)
    }
}

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        if (!tmp.ranks[rn]) tmp.ranks[rn] = {
            can: false
        }
    }

    for (let x = 0; x < RANKS.names.length; x++) {
        let rn = RANKS.names[x]
        /**@param hiii */
        /**@param WHOOPSSS */
        tmp.ranks[rn].req = RANKS.reqs[rn]()
        tmp.ranks[rn].can = (
            RANKS.names[x-1] ? player.ranks[RANKS.names[x-1]].gte(RANKS.reqs[rn]()) : player.pts.gte(RANKS.reqs[rn]())
        )
    }
}

function updateRanksHTML() {
    

   
        for (let x = 0; x < RANKS.names.length; x++) {
            let rn = RANKS.names[x]
            let unl = (!tmp.brUnl || x > 3)&&(RANKS.unl[rn]?RANKS.unl[rn]():true)
            tmp.el["ranks_div_"+x].setDisplay(unl)
            if (unl) {
                let keys = Object.keys(RANKS.desc[rn])
                let desc = ""
                for (let i = 0; i < keys.length; i++) {
                    if (player.ranks[rn].lt(keys[i])) {
                        desc = ` At ${RANKS.fullNames[x]} ${format(keys[i],0)} - ${RANKS.desc[rn][keys[i]]}`
                        break
                    }
                }
    
               
                tmp.el["ranks_amt_"+x].setTxt(format(player.ranks[rn],0))
                tmp.el["ranks_"+x].setClasses({btn: true, reset: true, locked: !tmp.ranks[rn].can})
                tmp.el["ranks_desc_"+x].setTxt(desc)
                tmp.el["ranks_req_"+x].setTxt(x==0?format(tmp.ranks[rn].req) + " Points":RANKS.fullNames[x-1]+" "+format(tmp.ranks[rn].req,0))
                tmp.el["ranks_auto_"+x].setDisplay(RANKS.autoUnl[rn]())
                tmp.el["ranks_auto_"+x].setTxt(player.auto_ranks[rn]?"ON":"OFF")
            }
}
}