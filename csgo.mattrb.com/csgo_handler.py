import struct
from steam import SteamClient
from csgo import CSGOClient
from csgo.enums import ECsgoGCMsg

# client = SteamClient()
# cs = CSGOClient(client)
# 
# @client.on('logged_on')
# def start_csgo():
#     print('launching csgo...')
#     cs.launch()
# 
# @cs.on('ready')
# def gc_ready():
#     print('launched csgo')
#     cs.send(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest, {
#         'param_s': 76561198261551396,
#         'param_a': 9990046271,
#         'param_d': 5638728974116512353,
#         })
# 
#     resp = cs.wait_event(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse, timeout = 2)
# 
#     print(struct.unpack('f', struct.pack('i', resp[0].iteminfo.paintwear)))
# 
#     pass
# 
# client.cli_login()
# 
# client.run_forever()
# #client.logout()

class CSGOHandler(object):
    client = SteamClient()
    cs = CSGOClient(client)

    def __init__(self):
        self.ready = False

    @client.on('logged_on')
    def start_csgo():
        print('launching csgo...')
        CSGOHandler.cs.launch()

    @cs.on('ready')
    def gc_ready():
        self.ready = True
        print('launched csgo')

    def send(self, s, a, d, m):
        CSGOHandler.cs.send(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockRequest, {
            'param_s': s,
            'param_a': a,
            'param_d': d,
            'param_m': m,
            })
        resp = CSGOHandler.cs.wait_event(ECsgoGCMsg.EMsgGCCStrike15_v2_Client2GCEconPreviewDataBlockResponse, timeout = 2)
        return resp

    def paintwear(self, s, a, d, m):
        resp = self.send(s, a, d, m)
        if resp is None:
            return resp
        paintwear = struct.unpack('f', struct.pack('i', resp[0].iteminfo.paintwear))
        return paintwear

    def login(self):
        CSGOHandler.client.cli_login()

    def logout(self):
        CSGOHandler.client.logout()
        print('logged out')
