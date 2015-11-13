def hi
  "Hello World"
end

def gw2_key 
  "50CBA2AF-C148-2344-983C-F0BDFD06C83616B0C80B-EEB0-44AD-81A0-7EA084E3A167" # DO NOT PUBLISH
end

def gw2_get(endpoint)
  result = open("https://api.guildwars2.com/v2"+endpoint+"?access_token="+gw2_key).read
  JSON.parse(result)
end

def bank()
  x = gw2_get("/account/bank")[0,10].map do |bank_item|
    next unless bank_item # skip empty band slots
    bank_item.merge(item(bank_item["id"]))
  end

end

def item(id)
  gw2_get("/items/#{id}")
end
