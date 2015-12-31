P2P Content Discovery
=====================

The goal of this document is to discuss the issues of "Peer Discovery" and "Content Discovery" within the scope of a distributed p2p content platform like Datt.

Peer Discovery as is currently implemented in `asyncGetAllWebRTCPeerIDs` would need to be improved upon for use in a production environment.

It is important to note that when are asking the question "What all Peers are currently available to us" we would probably ask soon "Also, in all of these Peers, what is the sort of content that they are have?".

The problem expounds when we factor in Search. If i want to see recent articles with an arbitrary keyword - say "Paris" - It is unreasonable for me have to do 1 request per peer for this query.

One Naive approach would be to broadcast to all peers that "i need any articles that you might have on the search term `Paris` , would you please get back to me when you can. kthankzbai." 
Of course the problem in this situation is scale, as is apparent to anyone with any experience crawling over at shady IRC DCC channels (`@find "Paris"` will make every available server send you private msgs if they have any content that they think you might find useful).

The drawbacks of this approach -
* Time : You can basically never know when your search is truly over as you can get a peer msg from a slow peer (maybe put your query in queue) long after you are done caring about the search term. 
* Control : Once a search is made, there is no way to pause or cancel the search. you will be bombarded with result pings whether you are want them or not.
* Trust : This method opens up a very nice way for a malicious peer on the network to easily create havoc by shoving results of spam in peer's who haven't requested it..

## Proposal : Centralize (some of) the things

If you think about it, a rendezvouz server is a point of centralization. 
Although - lots of individual rendezvouz servers make a decentralized network.
Let's start with the premise that all nodes already know how to connect to their rendezvouz server. 
And rendezvouz servers has access to an endpoint datt.co/rendezvouz/ with a list of "public" rendezvouz servers that a rendezvouz server can use to bootstrap itself.
Note that this list need not be complete or be a fully authoritative list of every rendezvouz server available. It is enough for it to at least have 1 server which part of the current active peer network.

Rendezvouz servers, when they connect to other rendezvouz servers can provide the following p2p queriable endpoints
    > List of all rendezvouz servers that it knows
    > List of all nodes connected to it

Recursively traversing this list will provide a decent method of "exploring" the peers on the network.

## Proposal : Search must always be local

A rendezvouz server should contain an index of every content that every node has on the network.
we can implement this index via a streaming webtorrent protocol where the index file, once updated by a rendezvouz server is immediately broadcasted via a torrent like protocol.
i.e. a distribution mechanism must be designed (maybe similar to raft consensus but not quite) to always keep a compressed index in sync with multiple peers individually updating their indexes. 
This situation can be thought if as an elasticsearch cluster if you make every member as a master and start indexing different data on each member of the cluster.

this would enable us to keep distributed mechanism in place while providing the option for a decent fast search.

this would mean that every node will query their parent rendezvouz server for a query and the the results can be a
