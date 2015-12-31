P2P Content Discovery
=====================

The goal of this document is to discuss the issues of "Peer Discovery" and "Content Discovery" within the scope of a distributed p2p content platform like Datt.

Peer Discovery as is currently implemented in `asyncGetAllWebRTCPeerIDs` would need to be improved upon for use in a production environment.

It is important to note that when are asking the question "What all Peers are currently available to us" we would probably ask soon "Also, in all of these Peers, what is the sort of content that they are have?".

The problem expounds when we factor in Search. If i want to see recent articles with an arbitrary keyword - say "Paris" - It is unreasonable for me have to do 1 request per peer for this query.

Of course the problem in this situation is scale, as is apparent to anyone with any experience crawling over at certain IRC DCC channels.

eg. `@find "Paris"` will make every available server send you private msgs if they have any content that they think you might find useful. If a server is slow, you can find yourself getting results of the last search you made while you are looking through the results of your new search.

One Naive approach would be to broadcast to all peers that "i need any articles that you might have on the search term `Paris` , would you please get back to me when you can. kthanxbai." 

The drawbacks of this approach -
* Time : You can basically never know when your search is truly over as you can get a peer msg from a slow peer (maybe put your query in queue) long after you are done caring about the search term. 
* Control : Once a search is made, there is no way to pause or cancel the search. you will be bombarded with result pings whether you are want them or not.
* Trust : This method opens up a very nice way for a malicious peer on the network to easily create havoc by shoving results of spam in peer's who haven't requested it..

## Proposal : Centralize (__some of__) the things

If you think about it, a rendezvouz server is a point of centralization. 
Although - lots of individual rendezvouz servers make a decentralized network.
Let's start with the premise that all nodes already know how to connect to their rendezvouz server and that rendezvouz servers will be aware of a hypothetical endpoint datt.co/rendezvouz/ with a list of "public" rendezvouz servers that a rendezvouz server can use to bootstrap itself into the network.

Note that this list need not be complete or be a fully authoritative list of every rendezvouz server available. It is enough for it to at least have 1 server which part of the current active peer network.

Rendezvouz servers, when they connect to other rendezvouz servers can provide the following p2p queriable endpoints
* List of all rendezvouz servers that it knows
* List of all nodes connected to it

Recursively traversing this list will provide a decent method of "__exploring__" the peers on the network.

so the architecture of such a network will look like this

```
(nodes) -> (rendezvouz servers) <- (nodes)
                    ||
(nodes) -> (rendezvouz servers) <- (nodes)
                    ||
(nodes) -> (rendezvouz servers) <- (nodes)
```

rendezvouz servers form a sort of backbone that connect the network organically.

## Search must always be local

A rendezvouz server can contain an index of every content that every node has on the network.

We can implement this index via a streaming webtorrent protocol where the index file, once updated by a rendezvouz server is immediately broadcasted via a  bitTorrent like protocol operating in swarm mode. 

i.e. a distribution mechanism must be designed (maybe similar to raft consensus but not quite) to always keep a compressed index in sync with multiple peers individually updating their indexes. This situation can be thought if as an elasticsearch cluster if you make every member as a master and start indexing different data on each member of the cluster.

This would enable us to keep distributed mechanism in place while providing the option for a decent fast search.

This would mean that every node will query their parent rendezvouz server for a query and the results will be much faster.

## Content is always requested from the Peer Node

Rendezvouz servers serve to provide a backbone network and assist peer nodes to identfy / discover content on the network without putting undue stress on it.

To maintain the idea of a completely decentralized network, rendezvouz servers should not host content themselves.

Over time there will be a significant overhead in maintaining the indexes as it can grow in propotion to the amount of content on the network. There __could__ be an bitcoin incentive for people to run rendezvouz servers. Although it might not be the best idea to actually charge bitcoin per search, a compromise would be for node to __"subscribe"__ to be able to query the rendezvouz servers indexes for a monthly 0.25$ fee.

A further model would be to allow people running rendezvouz servers to be able to adjust their pricing in relation to the size of their index. So rendezvouz servers having higher index coverage will have higher number of nodes connecting to them.

It is to be noted through, that much like bitcoin is today, this approach will make it cost prohitive for new players to compete in the ecosystem once the network has grown large enough to reach "critical mass" and there are a fair number of existing trustworthy rendezvouz server brands existing in the ecosystem.
