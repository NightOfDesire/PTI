const RANKS = {
    reset(type) {
        switch(type) {
            case "rank": 
            if (tmp.ranks[type].can) {
                player.essence = E(0)
                player.pres.pts = E(0)
                player.ranks[type] = player.ranks.rank.add(1)
                addNotify(`Ranked up to ${format(player.ranks.rank.add(1), 0)}.`, 1)
            }
            default:
                if (tmp.ranks[type].can) {
                    player.essence = E(0)
                    player.pres.pts = E(0)
                    player.ranks.rank = player.ranks.rank.add(1)
                }
        }
    },
    reqs : {
        rank(x=player.ranks.rank) {
            let base = E("10000")
            let inc = E(4.738)
            inc = inc.pow(x.div(50).add(1))
            let req = Decimal.mul(base, Decimal.pow(inc, x))
            return req
        }
    },
    text: {
        "1": `Prestige Shard gain is raised by 1.15, ${formatMult(2)} Essence`
    },
    effects: {
        
    }
}

function updateRanksHTML() {

    tmp.el.rankup.setHTML(`
    Reset your progress but rank up. ${RANKS.text[player.ranks.rank.add(1)] ? 'At rank ' + format(player.ranks.rank.add(1), 0) + ' - ' + RANKS.text[player.ranks.rank.add(1)] : ''}
    <br>Need: ${format(RANKS.reqs.rank())} Essence
    `)

}

function updateRanksTemp() {
    if (!tmp.ranks) tmp.ranks = {}
    for (var name in RANKS.names) {
        tmp.ranks[name] = {
            can: player.essence.gte(RANKS.reqs[name]()),
        }
    }
}

setInterval(updateRanksHTML, 50)