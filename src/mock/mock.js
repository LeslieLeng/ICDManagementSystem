const Mock=require('mockjs')

Mock.mock('http://api/users',(req,res)=>{
  return Mock.mock({
    "user|20":[{
      "name":'@cname',
      "id|+1":1,
      'age|10-20':1,
      "birthday":"@date(yyyy-MM-dd-hh)",
      "address":"@city(true)"
    }]
  })
})