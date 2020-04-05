# importing the requests library 
import requests 

# api-endpoint 
URL = "http://localhost:5000/api/v1/search"

# defining a params dict for the parameters to be sent to the API 
PARAMS = {'find': 'as'} 

# sending get request and saving the response as response object 
r = requests.get(url = URL, params = PARAMS) 

# extracting data in json format 
data = r.json() 

print(data)