const getSessionSql = `
SELECT
 MAX( msgSeq ) AS msgSeq,lcid,message,msgType
FROM
 (
 SELECT
  MAX( msgSeq ) AS msgSeq,
  "from" as lcid,
  message,
  msgType 
 FROM
  lchat_message 
 WHERE
  "to" = '?' 
 GROUP BY
  "from" UNION ALL
 SELECT
  MAX( msgSeq ) AS msgSeq,
  "to" as lcid,
  message,
  msgType 
 FROM
  lchat_message 
 WHERE
  "from" = '?' 
 GROUP BY
 "to" 
 ) as temp GROUP BY lcid
`

const getGroupMessageSql = `SELECT * from lchat_message WHERE "to" = '?'`

export default {
    getSession(userId) {
        return getSessionSql.replaceAll('?', userId)
    },
    groupMessageSql(groupId) {
        return getGroupMessageSql.replaceAll('?', groupId)
    }
}