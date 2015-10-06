/**
 * ContentList
 * ===========
 *
 * A list of content titles with links to their pages.
 */
'use strict'
let React = require('react')

let ContentList = React.createClass({
  getInitialState: function () {
    return {
      contentList: []
    }
  },
  setStateFromDattcore: function () {
    let dattcore = this.props.dattcore
    return dattcore.asyncGetRecentContentAuth().then(contentauths => {
      let contentList = contentauths.map(contentauth => {
        let key = contentauth.cachehash.toString('hex')
        let title = contentauth.getContent().title
        return {key, title}
      })
      this.setState({contentList})
    })
  },
  componentWillMount: function () {
    return this.setStateFromDattcore()
  },
  componentWillReceiveProps: function () {
    return this.setStateFromDattcore()
  },
  propTypes: {
    dattcore: React.PropTypes.object,
    dattcore_status: React.PropTypes.string
  },
  render: function () {
    let titleList = this.state.contentList.map(function (obj) {
      return <li key={obj.key}>{obj.title}</li>
    })
    return (
      <ul>
        {titleList}
      </ul>
    )
  }
})

module.exports = ContentList