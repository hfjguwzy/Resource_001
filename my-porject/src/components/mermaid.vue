<template>
  <vue-mermaid :nodes="Arr" type="graph LR" @nodeClick="editNode"></vue-mermaid>

</template>

<script>
const arr = []
export default {
  data() {
    return {
      data: [
        {
          id: "1",
          text: "A",
          link: "---",
          next: ["2"],
          editable: true,
          style: "fill:#f9f,stroke:#333,stroke-width:4px",
        },
        { id: "2", text: "B", editable: true, edgeType: "circle", next: ["3", '7', '8'] },
        { id: "3", text: "C", next: ["4", "6"] },
        { id: "4", text: "D", link: "-- This is the text ---", next: ["5"] },
        { id: "5", text: "E" },
        { id: "6", text: "F", next: ["5"] },
        { id: "7", text: "g", editable: true, edgeType: "circle", next: ["5"] },
        { id: "8", text: "h", editable: true, edgeType: "circle", },
      ],
      textjson: {
        "msg": "success",
        "code": 200,
        "data": [
          {
            "serverId": "d7b74dc5e4a24f56965d0c0c11d81c99",
            "parentId": "/",
            "label": null,
            "children": [
              {
                "serverId": "HA-TSA-01",
                "parentId": "d7b74dc5e4a24f56965d0c0c11d81c99",
                "label": "string:string",
                "children": [
                  {
                    "serverId": "TSA-01",
                    "parentId": "HA-TSA-01",
                    "label": "string:string",
                    "children": [
                      {
                        "serverId": "HA-SDF-01",
                        "parentId": "TSA-01",
                        "label": "string:string",
                        "children": [
                          {
                            "serverId": "SDF-01",
                            "parentId": "HA-SDF-01",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-02",
                            "parentId": "HA-SDF-01",
                            "label": "string:string",
                            "children": []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "serverId": "TSA-02",
                    "parentId": "HA-TSA-01",
                    "label": "string:string",
                    "children": [
                      {
                        "serverId": "HA-SDF-02",
                        "parentId": "TSA-02",
                        "label": "string:string",
                        "children": [
                          {
                            "serverId": "SDF-03",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-04",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-05",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-06",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "serverId": "HA_SVS-01",
                "parentId": "d7b74dc5e4a24f56965d0c0c11d81c99",
                "label": "string:string",
                "children": [
                  {
                    "serverId": "SVS-01",
                    "parentId": "HA_SVS-01",
                    "label": "string:string",
                    "children": [
                      {
                        "serverId": "HA-SDF-02",
                        "parentId": "SVS-01",
                        "label": "string:string",
                        "children": [
                          {
                            "serverId": "SDF-03",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-04",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-05",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-06",
                            "parentId": "HA-SDF-02",
                            "label": "string:string",
                            "children": []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "serverId": "SVS-02",
                    "parentId": "HA_SVS-01",
                    "label": "string:string",
                    "children": [
                      {
                        "serverId": "HA-SDF-03",
                        "parentId": "SVS-02",
                        "label": "string:string",
                        "children": [
                          {
                            "serverId": "SDF-07",
                            "parentId": "HA-SDF-03",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-08",
                            "parentId": "HA-SDF-03",
                            "label": "string:string",
                            "children": []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "serverId": "SVS-03",
                    "parentId": "HA_SVS-01",
                    "label": null,
                    "children": [
                      {
                        "serverId": "HA-SDF-04",
                        "parentId": "SVS-03",
                        "label": "string:string",
                        "children": [
                          {
                            "serverId": "SDF-09",
                            "parentId": "HA-SDF-04",
                            "label": "string:string",
                            "children": []
                          },
                          {
                            "serverId": "SDF-10",
                            "parentId": "HA-SDF-04",
                            "label": "string:string",
                            "children": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      Arr: arr,
    };
  },
  mounted() {
    this.getfirstfloor(this.textjson.data);
    this.getid(arr);
    this.getnext(arr);
  },
  methods: {
    editNode(nodeId) {
      alert(nodeId);
    },
    // 取json对象的第一层
    getfirstfloor(data) {
      for (let i = 0; i < data.length; i++) {
        const temp = data[i];
        const serverId = temp.serverId;
        const parentId = temp.parentId;
        const obj = { 'id': serverId, 'parentId': parentId, 'text': serverId, 'next': [] };
        arr.push(obj);
        this.getchildren(data[i]);
      }
      // console.log(arr);
    },
    // 递归的取children
    getchildren(data) {
      if (data.children.length !== 0) {
        for (let i = 0; i < data.children.length; i++) {
          const temp = data.children[i];
          const serverId = temp.serverId;
          const parentId = temp.parentId;
          const obj = { 'id': serverId, 'parentId': parentId, 'text': serverId, 'next': [] };
          arr.push(obj);
          this.getchildren(data.children[i]);
        }
      }
    },
    getid(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].id = i;
      }
      // console.log(arr);
    },
    // 对数组arr的每一项添加next数组
    getnext(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (arr[i].parentId === arr[j].text) {
            arr[j].next.push(arr[i].id);
            break;
          }
        }
      }
      console.log(arr);
    },
  }
}
</script>

<style>
</style>