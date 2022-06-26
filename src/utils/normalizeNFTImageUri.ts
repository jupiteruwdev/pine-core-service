export default function normalizeNFTImageUri(uri: string) {
  if (!uri) return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIgdmlld0JveD0iMCAwIDEwODAgMTA4MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNC4yLjA8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgNTQwIDU0MCkiIGlkPSIyMTIwYTk0OS0zOTQyLTRkOTQtYmU5Zi05NjdiZWUyZTUwOGYiICA+CjxyZWN0IHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgeD0iLTU0MCIgeT0iLTU0MCIgcng9IjAiIHJ5PSIwIiB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxMDgwIiAvPgo8L2c+CjxnIHRyYW5zZm9ybT0ibWF0cml4KEluZmluaXR5IE5hTiBOYU4gSW5maW5pdHkgMCAwKSIgaWQ9ImM1M2ZlMDAzLWJhOWQtNGZkNy1hNTBhLTRkNTdlYTE2MzdjYyIgID4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgyLjcgMCAwIDIuNyA1NDAgNTQwKSIgaWQ9IjZjNmRiMzQxLTcxYjUtNGQ1OS1iODFkLWQ0YjAzYThhMWQ5ZCIgID4KCTxpbWFnZSBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigwLDAsMCk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRQUFTQUJJQUFELzRRQk1SWGhwWmdBQVRVMEFLZ0FBQUFnQUFZZHBBQVFBQUFBQkFBQUFHZ0FBQUFBQUE2QUJBQU1BQUFBQkFBRUFBS0FDQUFRQUFBQUJBQUFCa0tBREFBUUFBQUFCQUFBQmtBQUFBQUQvd0FBUkNBR1FBWkFEQVNJQUFoRUJBeEVCLzhRQUh3QUFBUVVCQVFFQkFRRUFBQUFBQUFBQUFBRUNBd1FGQmdjSUNRb0wvOFFBdFJBQUFnRURBd0lFQXdVRkJBUUFBQUY5QVFJREFBUVJCUkloTVVFR0UxRmhCeUp4RkRLQmthRUlJMEt4d1JWUzBmQWtNMkp5Z2drS0ZoY1lHUm9sSmljb0tTbzBOVFkzT0RrNlEwUkZSa2RJU1VwVFZGVldWMWhaV21Oa1pXWm5hR2xxYzNSMWRuZDRlWHFEaElXR2g0aUppcEtUbEpXV2w1aVptcUtqcEtXbXA2aXBxckt6dExXMnQ3aTV1c0xEeE1YR3g4akp5dExUMU5YVzE5aloydUhpNCtUbDV1Zm82ZXJ4OHZQMDlmYjMrUG42LzhRQUh3RUFBd0VCQVFFQkFRRUJBUUFBQUFBQUFBRUNBd1FGQmdjSUNRb0wvOFFBdFJFQUFnRUNCQVFEQkFjRkJBUUFBUUozQUFFQ0F4RUVCU0V4QmhKQlVRZGhjUk1pTW9FSUZFS1JvYkhCQ1NNelV2QVZZbkxSQ2hZa05PRWw4UmNZR1JvbUp5Z3BLalUyTnpnNU9rTkVSVVpIU0VsS1UxUlZWbGRZV1ZwalpHVm1aMmhwYW5OMGRYWjNlSGw2Z29PRWhZYUhpSW1La3BPVWxaYVhtSm1hb3FPa3BhYW5xS21xc3JPMHRiYTN1TG02d3NQRXhjYkh5TW5LMHRQVTFkYlgyTm5hNHVQazVlYm42T25xOHZQMDlmYjMrUG42LzlzQVF3QUNBZ0lDQWdJREFnSURCUU1EQXdVR0JRVUZCUVlJQmdZR0JnWUlDZ2dJQ0FnSUNBb0tDZ29LQ2dvS0RBd01EQXdNRGc0T0RnNFBEdzhQRHc4UER3OFAvOXNBUXdFQ0FnSUVCQVFIQkFRSEVBc0pDeEFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUS85MEFCQUFaLzlvQURBTUJBQUlSQXhFQVB3RDhmNktLSyt3UG13b29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0QvLzBQeC9vb29yN0ErYkNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBUC8vUi9IK2lpaXZzRDVzS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0EvLzlMOGY2S0tLK3dQbXdvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnRC8vMC94L29vb3I3QStiQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29wd1ZwSFdOUVdadmxBQTYwRS9DTm9yNlorSFg3Tit2K0pFWFUvRnJ2bzFpM0t3NC8wbVQvQUlDM0VmOEF3TDVoL2RxSDRpL3M0K0lmREFiVWZDalByVmdvM1BIdC93QklqLzRDdjMvcXVQOEFkNzE1L3dEYWREbjVPWStiL3dCY012OEFySDFiMnZ2ZmdmTmxGS3lzcFpXQlZsOXFTdlFQcGdvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBUC8vVS9IK2lpaXZzRDVzS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0t2YVhwV3BhNWZSYWJvOXRKZDNNeHdzY2FsbU5mWW53Ny9acXRMS0tMVy9pVEtzaFREL1kwYjVFOXBwTzU5bCtYL2E3VnhZckhRb3g5NDhMTytKTUxnWTgxV1h2ZHVwODRlQnZoZDR0K0lGenQwUzI4dXpWZ3NsM0tDSVUvd0NCZHo3REovblgyWG9QZ0g0WS9BN1NQN2E4UVhNYzkvamk1dUJ1ZG1IT0xlUG5INEF0ampkWE0rTy8yaWZEM2hTMWJ3NThPWUlidVdBYkZtVmR0ckYvMXpWY2J5T3hCMjkvbTZWOFphLzRqMXp4VHFMNnJyOTdKZVhEL3dBVWg0WDJWZUFvOWdBSzg3MlZmRmZ4TklIeC93QlZ6TE4vZXJmdXFYYnF6M2I0ay90RitJUEU3U2FiNFczNlBwaHlwa0RmNlJLdisweThJUFpmKyt1MVMvRGI5bzNYL0RJaTByeGFyNnRwNElDemY4dkVTOS9tNERqL0FIdm0vd0JydFh6VFJYZC9aZEhrNU9VK28vMVB5LzZ2OVc1UGQvRS9RelgvQUllZkRQNDI2V2RjOE4zVWNGK1FmOUp0K0R1N0M0ajQvd0RaVzZmU3ZqUHh6OE12RmZnQzY4clhiVC9SV1lyRmN4Z3RESi93THNUNkg1c2MrOWN6NGQ4UzY3NFMxRk5WOFBYc2xsY3AzalBETDZNdlJoN0VWOW8rQmYyaGZEWGk2MkhoejRqMjhOcE5NQWhrZGQxckw2N2xiTzNwenUrWCtWY1BMV3dudzZ3L0UrWitxNWxrL3dEQy9lMHUzVkh3cFJYMmY4UlAyYVlMaEpOYStHMHE3bkpmN0ZLMkZQdERJZjVOL3dCOWRxK1B0VDB6VU5HdnBkTjFTMmt0TG1FN1pJNUYyc0s5SEI0eUZhUE5FK3Z5VGlMQzQ2UE5TbDczYnFVYUtLSzdUM0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0QvMWZ4L29vb3I3QStiQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUs5UDhBaFY4TkwzNGs2NjFpa3h0TE8xWHpMbTQyNXd2WlY2Y3R6ajZIMHJ6U0tPU2FWSUlFTWp5RUlxZ2NsbXI5RDlGc3ROK0Fud25lL3Z3cDFGMTh5VVp6NXQzTDkyTDZLTUE0eU1LVzdtdk56VEZTcHc1YWZ4TStSNHV6cWVGcFJwVVA0czlFZGhwdmhudzU4Sk5BMytGTkJ1TCs0UHlrVzZHVzVuYnI4ek5rZ2ZRYlIxMjE4WS9GYng1OFV2RTg4bHZyOWhkYU5waXQ4bHFJcEkwUC9YUm1VYnorUTdoZXRlZkw4UlBIY2QyOTNCcjk3RExJeGtieTU1RlFNM1BDN3NmcFhaYVo4ZmZpbnBlNVgxWVgwVForUzVpamNIL3gzZjhBK1BWeFlmTGF0T1h0Sldjanc4cjRVeE9GbjdlcGFyUHp1ZU1ibGI3cEZMWDBFUGpONFYxNWZLOGRlQk5PdldiNzA5bi9BS05ML24vZ1ZiV2lmRHo0UWZGQzVheDhDYWxxR2k2bnRhVDdMZHhlZkh0VDczemYvWlY2RThieVIvZVI1VDZXcm44cUVlYkYwbW85OTBmTWRGZlFYeEsrQVdxZkQvUlA3ZmcxRmRVdFl5b3VCNVhsR1BmOG9QM255TWtEdFR2aHQrejlxbmp6UVI0aHU5U1hUTGVVc0xjZVY1cGsyZkxuN3lZRzRHaiswYVBKejgzdWxmNjJZRDZ2OWI5cDdteDg5MG55K29XdnAzVy9BSHdlK0Y5My9aL2pmVWRRMXpWVlZaUHMxdEY1RWUxL3UvTi85bFdML3dBTG84TWFDdmwrQmZBdW5XTzM3czkzL3BNditmOEFnVkVNYnovdzQ4eE5MUDZsZVBOaHFUY2UreUsvd244ZS9GSHcxT2tHaGFkZGExcGJINXJVeFNTS1ArdWJLcEtmbmpQSld2c2pWUENuaHY0dGFDRzhUNkZjMkU2L0tyVEtZcm1CdXZ5dHdTdm9EOHA2N2ErSTlUK1B2eFMxVGFrZXIvWVlseDhsdEZIR09QOEFnTy8vQU1lcmpSOFJ2SGYyK0svbDE2OW5lSmhLdm1UeU1tNVBWUzJEWEJpc3JuT1h0STJVajVqTk9GTVRpcXYxbW5hbFB5dWEzeFMrRzE3OE5kZkdteXltNXM3aGZOdHJqYmpldmNOMTVYdjlSNjE1clg2SitKOVAwNzQ4L0NhTFZ0S1ZWMUdLUHpvQm5tTzZYbVNMNk5qYnp4OTF2U3Z6dWtXV0oyaWxRbzZuQkJISWF1M0s4WTZzZVdYeFJQZTRSenVlS29TaFgvaXcwWTJpaWl2UlByZ29vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQVAvVy9IK2lpaXZzRDVzS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaXRYUWREdi9FbXQyZWg2WXU2NHZKQkZIMkh1emV5OVQ3VVNsYVBOSWlyVmpDTXB5K0UraXYyYXZoNy9idXR2NDAxS0xObnBMYmJjRWZMSmRkajIvMWEvTjdOdFByV1ArME44UVQ0cjhVLzJGcDBtN1RkR0xKd2Zsa3VPanQ3N2VWSDRudlgwUDhBRUxXZE0rQ253dXR2RGVnTUJmWE1mMmEySTRKazZ6VE4yN2srek1LL1BENXZ2Tm12QndFZmIxWlY1ZkQwUHpuaHVsTE1jYlBOSzN3clNIK1l0RmFPazZOcW5pQzlUVE5HdFpMeTVsKzdIRXU1cTk4dC9oYjRNK0g5dW1xZkdMVlExMHczeDZSWXQ1azcvd0RYUnY0Zi9IVi8ycTlmRVlxRVA4UjlyanM0cFVQZGxySjlGdWVJZUh2Qyt2OEFpcThXeDhPV010OUwzQ0w4cTUvdk45MWZxVFgwejRJOFBhRjhETlUvNFNUeHo0aWdUVWZLYVA4QXN5MVh6NW1WdXpOMnoxNXd1UjkvdFhuZmlMNDVhMU5ZdG9IZ2EwajhLNk91UUk3VWJablhwODBuYlA4QXNnSDFhdkRuZVNWekpLNWQyNUpKeVRYSk9sVnJSNWFudXhQSnhHRHhlT2hLblg5eUV1blUrb1BpeiswRFkrTnZEVGVHZkQybnpXOFYwVmE0bHVDdVNxdHUyS2k1L2lIWGQ3ZTlTL0NuOW9PeThIZUc0ZkRuaUd3bnVJN1V0OW5sdHlwUGxzMjdES3pEN3VUeitIdWZsaWluL1pORGs5ankrNkwvQUZMd0gxWDZweSs1ZS96UHJmeHI0WTBmNDQ2cS9pYndKNGpnbTFEWXFmMlpkRHlKZ3EvM2V1VDEvd0JuUDhmYXZtWFgvREhpRHd0ZG14OFEyTXRqT2V6cmdIL2Rib1I3Z2tWaVF5eVFTck5BNWpkT1F3T0NHcjNIdzc4Y2RYaHNSb2ZqK3ppOFY2TWVESGNqTTZMMXlzbkJKOXp5ZjczZWxHbFZvcmxqNzBTNkdEeGVCaEduUTkrRWVuVThNb3I2TXV2aFI0UjhmVzB1cmZCM1ZROXdvM3lhUmVONWM2ZjljMmI3My9vUCsxWGdlcmFScXVnMzBtbTZ4YXlXVnpGOTZPVlNyRDg2NnNQaW9UK0g0ajFNRG5GR3Y3c2ZpN1BjOTcvWnorSUo4TWVKL3dEaEc5UmZHbmF5d1ZjbkFqdWVpbi9nWDNmcnQ5S3UvdEkvRHNlSHZFQThXYWJIaXcxZGo1b0E0anVmNHY4QXZzZk43bmRYelNyTXJibEpWbDZjMStoZmdqVjlOK09Yd3BtMERXMkIxQ0JGdDdnOVdTWmY5VkwvQU1DSXo5UVIycnljYkYwS3NhOGZoNm54WEVWS1dYWTJHWlUvZ2xwUC9NL1BLaXRQWE5Hdi9EdXNYZWg2bkdZN216a2FPUWY3UzhmK1BWbVY3MFpSY2VZL1JhVldNNDgwUW9vb29OQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0EvOWY4ZjZLS0srd1Btd29vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLKzJmMmFmQWNXazZkYy9FZld3SVdtVmt0REp4c3QxLzFrdjhBd0xsYzU0Q24rOVh6RDhPUEJOMTQvd0RGbG5vTUdVaEo4MjRrWEg3dTNYN3gvVUFlNUZmWlh4cDFIVWY3THNmaFI4UDdWcEwrK1JZM2loQVBsV2kvTHRadWRvYkdDVzQyZzU2ZzE0ZWJZaThvMEkvYTM5RDg1NDF6Q1ZXVU10b3l0ei9FK3lQa1Q0cytQcC9pQjR1dWRSREVXTUg3bXpVNTRpWHY5VzVKOU00cm92Q0h3Y3V0UzA5ZkV2amU4WHcxNGVVN3ZPbS8xc3E5UUk0MjdOMlk1emtiVmF1dlhUZmgvd0RCRkJOcndpOFUrTWwrWkxSRHV0TE52K21uOTVrLzc2LzJWKzlYaUhqRHh6NGw4YzZoOXY4QUVkNDA1VWZ1NHdjUndyNlJyMEgvQUtFYTZLWE5KZXpwYVI3bnFZRDJ0U2xHaGcvY3BMN1hmMC96UFdOWCtNR20rRzdOOUErRHVualI3VThTYWhJTjEzUDc3bXh0SDUvOEI2VjRGZFhOemUzRDNWNUkwODB4M05JN2JtWnY5cG1xQ2l1N0Q0ZW5ENFQ2SEE1VlR3L3dMM3UvVUtLS0syUFJDaWlpZ0Fvb29vQW50YnE3c3JoTHl6bGVDZUU3bGtSdHJLMyt5eTgxNzlwUHhmMGJ4VGFmOEkvOFl0UEdxVzVCRVdwUWpiZFFlL3kvZS96OHJWODlVVnoxNkVKL0VlYmo4cm80ajNxa2ZlajE2bnRQakw0TjMya2FmL3drdmc2OFh4SDRlZjVoY1E4eVJMMUlralhrYmNja2RNSGR0NlZrZkNEeDlMNEI4WVc5ODdIK3pyby9aN3RSL3dBOG4vaTdmZGJEZmhpdWU4SGVPL0V2Z1hVRnYvRDEwWVJuOTVFZVk1Vi82YUwvQUZHR0ZlenZvdncvK05rYlhIaG55dkMvakJodWV4YzdiUzhiL3BuL0FIVy96dC9pcmpxODBWN090NzBlNTgvai9hMDZVcUdPOStrK3ZiMS96TzUvYVo4QXBxRnJCOFFOSVVPMFlXSzgyNUplSG9raDkxNFUrMlBTdmk2djBJK0RPcDMxL29kNzhLUEg5bzhkL3A4VFJlVk1NZWRaUDhveDAzQmVWQkJ4dDI0OWErTGZpRjRNdS9BZmlxODhQWE9USEdkOXZJd3g1a0xmZGI4T1FmY0d1ZktjUmJtb1MreitSNTNCV1lTcFNubHRhVjVRMmZkSEUwVVVWN2graGhSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFCLy85RDhmNktLSyt3UG13b29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb3J1ZmhscGtHdGZFRFFkUHVVRWtFbDFHWkZJNEtwOHpEOGdhbXJQa2pLUno0eXVxTktWV1hUVSszUGdYNEh0UEFIZ3Q5ZDFzcmJYbW9yNTl4STV3SXJmcXFsdU1kTXQrWGF2RVBpVDhkb1JmNmxZZkRVR0Q3YS84QXBlcU1QMzgvWUxIdStaRVFjTDBJSDNkdmYyajQ2L0ViUS9Da3Rob1d1YUN1dTI5NnB1R1JwMmhBMnRoZnVxU2UvY2RLK2NGOGFmQWU4NHZ2QVZ4Wjd1OXZlTngvMzB5Vjh0ZzZVcHYyOVNQTmMvSE9IOEhQRTFaWmxpNlRuejdXdGI4endKM2VWekxLeFoyT1NTY2t0VGErZ0RaL3M0Nndkc04vck9oRnU4a2F6eGovQUw1MzAvOEE0VXI0YzF2L0FKRXZ4NXB0KzdkSXJvL1pwZjhBMmIvMEd2ZSt1d1h4YUg2WERpR2l2NGtYRDVIejVSWHF1dmZCVDRtZUhnWkxuUlpMcUpSL3JiUStjUDhBeDM1L3pVVjVaTEhMQkswVXlHTjE2cXcya2Y4QUFhNnFWV0UvaGtlcmhjeG8xNDgxS2FrTm9vb3F6ckNpaWlnQW9vb29BS0traWhsdVpWaHQ0MmxkdWlxTWsxNm5vUHdTK0p2aUVDU0RScExPSmgvcmJzK1NCOWQzei9rdFpWYThJZkZJNU1UanFOS1BOVm1vbmxGT2psbGlkWllITWJvY2dnNElhdm9FZkJid3ZvdlBqWHg3cDFpNi9laXRQOUpsL3dBLzhCcGkybjdPT2ovTE5lNjFycnIvQU04MVdDTS85OWJLNS9yOEg4TVcva2VWUGlHalA0RTUvSTZ2NGEvSFcwa3ZyR3orSkMrYkphT1JhYXFvSW1pMy9LVW0yOHNyZE00OUMzcVBZL2oxNEdnOGVlRUU4UzZIdHVMelRFTTBUSWR3bHR2dk1GMjUzZjNoMjYrdGZPRGVOdmdUYWNXUGdLNHVqNjNGMjMveFQxOUpmQXo0ajZMNHNXLzBIUmRDWFFyYlRsV1JZbG1hWUh6V1luN3lnanA3OWErZnhsS1ZPZnQ2Y1hHeCthY1FZT2VHcXh6TERVcFE1TjcydCtaK2QxRmRsOFJOTWcwWHgxcnVtVzZoSUlidVlScXA0QzdpVS84QUhjVnh0ZlZVcDg4ZVkvWThOWFZhbEdjZnRCUlJSVm5RRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFmLy9SL0graWlpdnNENXNLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUs5ei9aMHNCZS9GS3dreHhheFRUZlQ1Tm44MkZlR1Y5VC9zcDJRbDhYYXRma2MyMW5zei90U3lLUitpbXVETTVXb1NQbk9MNi9zc3RyeThqRy9hZXZ6ZGZFV0sxQndMT3pqalArOHpNLzhtRmZPTmVzL0hHK04vOEFGUFhaQ2NlWElzSS83WklxZnpGZVRWZVd4dFJoRTA0Vncvczh2cFI4a0ZKdDNVdEZkaDc1MStnZVB2R2ZobGcyaGExZFdxRC9BSlpoeTBmL0FIN2JLZjhBanRlcVFmSFNEWG8xcy9pWDRZc3ZFRWYzVFBHbmtYSS80Ri84VHRyNThvcm5xNEtFL2VsRThuRTVIaGF2dlNqNzNkYUgwVVBBdndoOGRIL2lnL0VqYURxRDlMTFZSOHU3KzZzbi93QmsxZWJlTHZoYjQzOEV5RTYzcHJtMjR4Y3cvdllUOVdYTzMvZ1FCcno2dnFEOW03eFA0aXZQRjBmaHE0MWFVNlVzTXNndFpEdlJtWCtGZDMzZXU3NWV1MDF5MStlakNVNHk1bytaNU9PK3RZQ2xLdlRuendqMGUvM255L1JYM2wrMEI4T1BCbHI0SXVmRWRoWVFhWmYyVWliV2hYeXhOdmsybFNxL0wzem5HZUtsK0FYdzQ4R1QrQ2JEeEplMkVHcVg5MlpIZVNaRmw4clpJeWhWVnNnRmR2MS9Tc1A3Ymg3SDJ2S2VaL3IvQUlmNmo5ZDVIdmEzbWZKZmhINFZlT2ZHenFkRTAxa3RlYzNNeDhxRUw3TTNMZjhBQVFUWG81OEVmQjd3TDgzam54RSt2NmdnNXNkS0g3dmQvZGFiL3dDeVdyLzdTSGlieEZhK01wL0RVV3J5L3dCbWVWRTR0WXpzUk42L2RZTDk3Kzk4M1RjSytacTNwYzlhTVpTbHl4OGowOEQ5Wng5S05lYytTRXVpMys4K2dwL2p1dWlSdFovRGJ3MVplSFl0dTBUc25uM0ovd0NCTi83TnVyeXJYdkhuakh4TXgvdDNXTHE2UnY0QzVXUDErNnUxZjBya3FLNnFXRGhENFluc1lQSmNOUzk2TVBlL20zRStWZnUwdEZGZEI2Z1Y5SmZzdDMvMlh4N2RXRHR4ZDJUL0FQZlN5S2Y1WnI1dHIySDREWDUwNzRxYUs0T0JNMGtQQS92eHN2OEFXdVBNWTNvemo1SHozRlZEMm1YMTQrUmEvYURzUDdQK0tlcVlHVXVGZ240UDk2TlFmL0hnYThVcjZmOEEycXJBUStOTk52bEhGelpLdi9Bb3BHUC9BTE1LK1lLTXVsZWhFamhHdjdYTGFFdklLS0tLN0Q2UUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BLzlMOGY2S0tLK3dQbXdvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQXI3Yy9aTHNBbW1hOXFSSE0wME1PZjl4V2IvQU5uRmZFZGZmMzdQWVRSL2hEZTYwNjQzeTNWeHp4OHNNZTAvK2l6WGo1M1A5eHlud3ZpSlY1Y3Y5bi9NMGo0ajhZNmdkVzhXNnpxT2MvYXJ5ZCtQK3VoSS9uWE8wNW1hUXRJeCtadm0vd0MrNmJYcXhqYVBLZmFZV2x5VW93ajlrS0tLS3MyQ2luQldabFZWTE0zeWdBVjlBK0cvZy9ZNlRwcStLL2k1ZG5STkxLbG9yTUgvQUVtNS93QmtyOTVmcGpkL3U5YTU2OWVNUGlPREhablN3NjkrWHBIcWVVZUVmQTNpYnh4Zkd4OE9XVFhES1Aza25TS1Avcm8zUWUzOFJyM1cwaitHdndOdUV1N202UGlyeGZiL0FIWTdkdkx0TFdUL0FHbS8vYWIvQUdWcmp2R0h4b3ZMMnhIaHZ3SmFEdzE0ZWorUVJROFR6TDNhU1JmNzNjRHJraG1iclhoOVlPbE90L0U5MlBZOGRZSEVZNy9lZmNoL0wxZnF6MFB4eDhUL0FCYjQvdU4ydTNJVzFWdDhkdEVOc1ViZHZsNms4OVNjMDd3TDhVZkYvd0FQWmdORXVRMW96YjVMU1VibzJidjdnbkhVRVY1MVJYUjlWcGN2SnkrNmVyL1krRjloOVc1RnlkajZodTdUNGEvSENkNzNUYmsrRnZHRno4elFYRGVaYlhVbit5Mzk3L3g3L1phdkNQRjNncnhMNEgxRTZmNGxzbnRtQk8xK3NjbmJNYmZkUDRHdVZyM1B3aDhhTG0xc1ArRVg4ZjJnOFM2REp4dG0rYWVKZWdNY2pjL0wyNkVmd3RYT3FVNlA4UDNvOWp5ZnFlSXdQKzdlL0RzOTE2TThNb3I2QThTL0I2MDFMVFc4Vi9DZTlPdTZSdERTV3cvNCtiZi9BR1dYN3pmVEc3cDk3clhnTEx0TzFzcXk5YzExVUs4S253bnM1Zm1kTEVMOTNMMVhWRGFLS0sxTzhLNnJ3SHFCMHp4dG9WL25Dd1h0dXpZL3VpUlMzNlZ5dExGTTBNcTNDL2VqS3VLaXJHOGVVNThaUzU2VW9kejdUL2Ewc0I5bDhQNm1vNWplZUUvOERWV0gvb0pyNHJyNzcvYVJSTlcrRmxqcThmT3k0dDUraCs3TEd5ai9BTkNGZkFsZVhray8zUEtmRytIVlcrWHhwL3l0cjhRb29vcjF6N29LS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQS8vOVA4ZjZLS0srd1Btd29vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBcjcvd0JNeDRkL1poTWgrUXlhVk0vL0FBSzdadjhBNHV2ei9iN3Z5L2U3VjkvL0FCbEo4UGZBZTIwZER0WXgyTnB6L3NiV1Avb3MxNG1iNnloVDh6OCs0NDkrcmhhSGVhL0ErQWFLS0s5cy9RUXJvdkRIaFRYZkdHcXBwSGg2MGE1dVhJemo3cXI2czNZZld1dzhBL0NyVy9HazV2TGsvd0JrYUpCaDdpL3VCdFFSOTl1N2JrL2p0SDZWMnZpajRwNlQ0VzB1WHdQOEhvallXQWJiY2FqMHVMcHVtVlk0SUhCNTR4bjVkdmZqcTRxOHZaMC9pUG44Wm5FblAyR0UxbitDOWY4QUkzRGMrQWZnT2hpdFJENG44Y0tQbWtJM1dsazMrei90Si8zMS91MTgrZUpQRkd1K0xOU2sxVHhEZVBlWEVoUExjS2k5Y0t2UlI3QVZndDh4M045NXU5TnFxV0ZqRDNwYXlPbkxzbmhSZnRhbXMzMWY2QlJSUlhVZXVGRkZGQUJSUlJRQnYrR1BGZXYrRDlUVFZmRDE0OXBPcEdjY3E2OWNNdlFqNml2b1FmOEFDQmZIaE5yQ0x3eDQ0WWY5dWw2My93QVYvd0NQZjcxZkxsS3JNcDNLU3JMNzF5MThMeis5SDNaSGpaaGs4YXI5clRsYWE2cjlUZjhBRTNoZlhmQ0dweTZSNGh0R3RMbU05RDBkZlZXN2o2Vno5ZlJYaG40b2FKNHYwcUx3UDhZWXpkMnBPMjExUWNYRnF4NmJtNTNEcHlSemo1dDNiZ3ZpQjhMdGM4QzNSdWdScVdpei9QYjM4UHp4c3Y4QXRiZWgvd0RIVC9EM3FhV0s5NzJkVDRqREI1dzFQMkdLamFmNFAwUE1xUnZtRzJsb3JzUGVrZm9CNGxIL0FBa2Y3TXlYSStkbzlNdFpQK0JXN0x1LzlCcjgvd0N2MEIrRk8veEYrejdjYVdSbGx0cjYyOWV1OWwvOUNGZm42TjJGcnc4bzBjNGVaK2ZjQys1UEZVUDVac1dpaWl2Y1AwTUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BLy85VDhmNktLSyt3UG13b29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0RvdkJ1aVMrSXZGV2s2SkZrbTh1WW9tL3dCM2RodjByN3orT3Zqenc5NFZ0dEowdld0RGkxMk83a2FUeVpITVpSWXVONCtVODRZZ2VsZlBIN01lZ0RVL0gwdXJTTG1QU3JkbjVIL0xTWDkyUC9IZDFaSDdSbmlGZGErSk54YXhuTUdtUlIyeTVQOEFGOTUveVppSzhIRlE5dGk0MCt4K2FaclJXT3pxblFmd3dWMmUwZUIvaHI4SnZpdm9rMnYyV2hYR2hvc3hoSWp1bWt5eXFyTnQzNUdQbS91MTVqNGwrR1hoNzRZL0UvdzlCcWQwYm53OWZUckptZkdVVld3Vms2S1Z5UnVPUHVrK2xkeDhJTC9VZmhGNEp2ZkUvamFZV21sYWhoN0t4WmYzMDhwSERyNkl5L2dldis5ODdmRWY0aWF2OFJkWlhVOVRqU0dPRmZMaGhROFJ4LzFMZHovZ0JVWVdsVmRXVVl5OXd3eXJDNDZwajZzS2RWeW9iSDZRK1BiS3cxTHdQckZ0ZFc1dTRIdFpOa2NTNzNMN2N4K1dxODUzWXI4bzVvWjdhVm9MaEdpbFRncTRJSS80RFhTNkY0NDhYK0djSFFOWHViTlIvQXJreCt2M1d5cC9FR3ZXb1BqbmE2L0d0cDhUL0RGbDRoaSs3OW9qWHlMbGYrQkwvd0RZMXJnOEhQRGMzTDcwVHY0ZnlMRlpSR2NZeDlyR1huci9BRjh6NTdvcjZMUHc1K0dQam9lYjhPUEVuOW0zMG5UVDlWK1U3djdxeWY4QTdWZVVlTHZoNTR5OER6bUx4SHBzbHVuYVlEZkMzKzdJdVZQNTE2VkxGUWsrWDdSOWJoTTh3OVdYcytibGwyWnhkRkZGZFI2d1VVVVVBRkZGRkFCUlhiZUV2aDE0eDhiWEN4K0hOTmtualk4ek1Oa0lQKzFJMkYvRE9hOVVQdzgrRm5nVWIvaU40bE9xM3k5ZFAwcjV2bS91dEovK3pYTExHUVQ1ZnRIa1l6UE1QVGw3UG01cGRscWZQVnRCTGMzS1c4RWJTeU1mdW9OeFArNm9yOWNyQ0hRTEh3dERDWVk3YlI0cllLWTVsMklzV3pwSXIvN1BYUDQxOEUzSHh6ZzBKUHNmd3k4TjJmaCtJY0M0WmZPdUQvdk0rYy9SdDFlUzYvNDE4VytKM0xlSWRXdWIwSEh5TTdlWC93QjgvZEg0S0s4M0dZT2VLbEhwRStRejNoL0U1dTRjL3dDN2l2UFgrdm1leS9DMzRRNko4U3RmMTNVSHVaSU5Cc3Joa2dTSS92SkZkbUtEYzNRS281eU1tdlJQSG5nWDRSL0I2MXRkU3Z2RDkxcmh1eTZKNWwwWXdHWGtidG4xL3VjNC9QNSsrR1B4VTFuNGFYMHNsaEVsM1ozV1B0RnU1eG5iMEt0MlBQdlh0ZnhrTjk4V3ZEZHA0NDhIM0p2dEswNUNMaXhDNGx0SGZoMlplcHhnWjY0SHpMOHVTTXNSU3FyRVJqVWw3aHpabmhjYkhNb1JyemNjTzlEMkQ0RmVPTkE4WGFacWVsNlBvc1doUldicXhnamZmdUVxL2ZQeWpuNWNIOEsrQS9GZWp6ZUhmRXVwNkpMa1BaWEVzUFBvcllCL0VWN0QremI0aC9zWDRqUjZmSysySFZvWkxmcng1aS92QWY4QXgzSDQxUDhBdE1hRU5KK0lSMUtOZHNXcXdKTndQNDAvZHNQL0FCMVQrTlZoWWV4eFVvZHpYS0tLd09kVG9SK0dhNWtmUE5GRkZlK2ZwUVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFCLy8xZngvb29vcjdBK2JDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tUNW0rVmZtYWdtUjk1L3MwNlhENGYrSHVwK0s3dkNDNmxra0p4L3l3dEYvbzIrdkw5SjhQNlI0WGp1UGpIOFZZZk51dFNua3VOTjB0djlaUEk3Ymxra1grNnYrMS93TCtGYStrWjlSMGo0UmZDZXhPcXdHVmJLM2poOGdEL1czRXZ6RWQvdk5ray9qN1YrZTNqTHhocmZqYlc1ZGIxMmJmSy9DcVB1eHg5UXFyNlY4dGdJVHJWWjFQc3MvSU9HcUZiSDRyRTE0NlFrL2k4bDBIZU52Ryt1K085WmJXTmRtM3QwampCK1NLUCs2cS81ejFyazZLSyttakdLanl4UDF1aFFoUmpHbkNQTEZCUlJSVm13VjZ2NFMrTS9qYndyR0xGN2hkWDB3bkQyZDZQTmpLLzNWWnZtQTU2WjIxNVJSV1ZXbENjZmVpY3VNd0ZLdkhscXg1ajZQL3N2NE9mRlAva0N6LzhBQ0QrSUpQOEFsM25PNnhtYi9aYitIL3gzL2RyeW54bjhPUEZ2Z1M2OG54RFlza0JQN3U0ak8rR1R2OHJkajdIRFZ3MWZTbndGOFQrTXRZMXhQQXhuaTFEUTVVTDNGdmVyNXFKRXZCRWZmdnd1ZHY4QU91S3J6MEk4MFplNzVuem1LcFY4dmhLckNmTkJkSCtqL3dBejVyb3I2MitPUHdPMGJ3NXBWeDR5OEpib0lJMlg3UmFGc29xdTIzZEgxUFVnWXozcWY0SC9BQU0wYlhkSnR2R1hpOVRjd3pGbXQ3UUhDRlViYm1UdWZtQjQ0L3BVL3dCclV2WmUxTWY5ZU1GOVMrdTgzdTdmTStmdkJYdzI4VytQTGtSNkJaRTI0UDd5NWtPeUdQOEEzbTcvQUVVRnE5VE5qOEcvaGJ6cWt4OGNlSUkvK1dFWjIyTUxmN1RmeGY4QWozKzdTZkhmeFI0MTBuWHBQQmJ6eDZmb2x1b052YldTK1ZHOFRkTjNjOU9SbmFEK2RmT05WU2pPdkhtbEwzZkkyd3RLdG1FSTFxczdRZlJmcS84QUk5VjhYZkdYeHQ0cmpOa2JrYVhwZytWTE95SGxSaGY3cmJlU09PbWR0ZVZVVVYzMHFVSWZERStpd2VCbzBGeTBvMkNpaWlyT3NLN0h3TjQ1MTN3RHJLYXRva3VNOFN4TWYzYzBmOTFsL3dBNDYxeDFGUlZqR2NlV1JqaXNMQ3RDVUtrYnhrZlV1cGVIdEgxeDdQNHovQ3FQWTJuWEVkeHFPbUQ3OXRJamJtYU5mN3JmN1A4QXZML2RyMGo5cDdTcmZXZkJHbCtLckxEcGFUTDg0SC9MRzdYci93QjlCZnpyNCs4RmVOZGI4Q2EzRnJXaVM0WUVDU01uNVpvKzZ0OWYwNjErZ3MxL28veGErRVY4K2p3bUtPOHRYUllXSCtxbmkrZFZ6MzJ1QnozNjE4MWpJVG9WWVZQc28vSk9JS05iQVl6RFY1YXdUdHpkYlBvZm1kUlJSWDFCK3Z4Q2lpaWdvS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdELzliOGY2S0tLK3dQbXdvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnRDc4K0VYeEQwejRxZUdiandUNHpWWmIrT0xaSUc2M1Z2MmRmOXRlcDc1RzcxeDhtL0ZINGNhajhPZGZmVDU5MHRqT1dlMG54anpJK3diL0FHbHlNNC9xSzRiU2RWMURRZFN0OVkwbVpyZTd0WER4eUwyYXYwRjBiVS9DL3dDMEw4UHBOUDFKRnQ5UWhBODFSOTYxdU8wa2YreTJQeUpYMU5mUFZZdkIxZmFSK0NXNStYNHlsUEpNVjlacGZ3Si9FdXo3bjUwMFYwWGlud3hxL2hEWGJuUXRiaTh1ZTNKNTdPdlpsOW14WE8xNzFLZDQ4MFQ5Tm9WMVVoR2RQNFpCUlJSVmxoUlJVMW5hWGVvWFVWbllSUGNYRXh3c2NZM003ZWlyUUtVb3FQTklocjZPK0J2aGJ4UG9tcXhmRU85bmkwTHcvYWpiTGNYV0I1OFRkVWpYN3gzWTRJSDNzWXpqRlRXSGdud2Y4SjdHTHhCOFU5dXA2MDY3N1RRNDIzYmY3clhEZjVYL0FIcThuOGQvRWJ4SDQvdnZ0R3N5aExhTW55YlNMSWlpWC9aWHVmYzVQOHE4MnJLVmY5M1QrSHVmSzRxdlV4NmxRb2ZCTFJ0L3AvbWV1ZkdiNDdSZU03S1h3cjRhaGFQU1dkVEpjU0REVDdPUUZYK0ZRd0IvdkhqM0JsK0RYeDVpOEhXVnY0VThVeE0rbHhzL2xYQ0RjOEc5dDJHWHV1NG5wbGhuNlkrWXFLUDdNcGV5OWx5KzZWL3FkZ3ZxbjFMbDkzOWU1OUZmSER3dDRuMWZWWlBpRGJ6eDYzb1Y2cStUZFd2ekxERXZDckl2YnJ5YzhzVDkzSUZmT3RkOTRDK0pQaVh3QmUrYnBVb21zNVNQdEZuTGt4VEwvdEwyUHVPZjVWNnBxUGdMd2o4VTlQbThSL0NnTFlhdWczM2VpU050Yi9hYTNiKzcvd0NPL3dDN1JTbktoKzdxZkQzREMxcDRDTWFGZjROazErcDgyMFZOZFdsellYVWxuZXhORFBDU0pJNUJ0ZEdYcUdXb2E5S01yL0NmVVJsRng1b2hSUlJRTUtLSzZYd2o0VTFmeHBydHRvR2pSNzVaMkdXUFNOTzdON0xtb2xLS2p6U01hOWVGT0VxbFNYdXhPbytGbncxMUQ0a2E4dHJGdWgwNjJJZTh1Q01iSS83cS93QzAzUWVuSjdFVjlWZkdQNGo2ZDhNL0RzUGdid1lpUVg4a1hsQVJrLzZKYjkyLzMyNTkrZHg3WjMvRUd0ZUdQMmZmQUVlbGFPaXphaE1wOGxXSHpUM0g4VXNuK3l2OHRxKzlmbnZxbXE2aHJlb1Q2dHFrelhGMWNzWlpKSE9TV3J3cVVKWXFmUEw0RnNmbStBcFR6dkZmV2FzZjNNUGhYZDl5alJSUlgwQituQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFILy8xL3gvb29vcjdBK2JDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUN1djhFZU5OWDhCYTlCcm1qbk8zNUpZeWNyTEQzVnY1ZzlpQWUxY2hSVVNqR2NlV1JqaXFFSzBKVTZrZmRrZm9oNDA4TGVIdmozNEZ0dGQ4T1NLdW94b1d0WkNjWWZxWUp1dU01d09jQWtFZktUbjgrTDJ5dTlOdkp0T3ZvbWh1SUhLU1JzTUZXWHFLOVMrRUh4UHZQaHZyd003Tk5vOTRRdDNBT25zNis2L3FPUFFqNlQrTi93QUw3THgxcEMvRVB3WUZudkJFc2tpeERJdTRNY0VmN1NyakhjZ1k3QVY0bUhrOExWOWxVK0I3SDV2bHVLbmt1SytwVjVmdVo3UzdlUjhJMFVWNkI4UC9BSWNhMzhRTDlvckxGdFpRRVBkM2tuM0lJLzZuMEgvMXlQYmxWakNQTkkvUnNWaW9VWWM5U1h1bUo0VzhKYTc0eTFWTkk4UFd4dUozNm5uYkd2OEFlWnVjQ3Zkcnp4QjRUK0I5cExvdmd4b3RhOFlTRFpkYWs0M1JXdjhBZWpoLzJ2OEFMZjNheVBGbnhIMFR3cm9yK0EvaEptR3o2WG1wL3dETGE3YnZ0YnNPdlQvZ1BxZm51dU9FSlZ2ZXFmRDJQbjRZYXJqcGUwcjZVdWtlcjlmOGk1cU9vMytyMzgrcDZwY1NYTnpjSGZKSkljczdWVG9vcnZqR0tqeXhQcElSaW84c1Fvb29vTkFxOXBtcDMralg4R3FhWGNTVzEzQVE4Y2taMmtOVkdpaVVZdVB2Q3Ewb3VQTEkrbmJUV2ZDUHgwdG90SjhXR0xRL0dhcHN0NzlSdGd2UDdxU0wvZS95djkydkJQRkhoYlhQQitxdnBIaUcxYTJ1SS95ZGY3eXQzRmM3WDBQNFcrSWVpZU1OR2o4QmZGb21XQWZMWTZxZjlkYU4yOHh1NDZjblArMTZqZ2xHVkgzcWZ3OWo1aVdIcTRDWFBSOTZsMjdlbitSODhVVjMzajc0ZTYzNEExRVd1cEtKcldYNTdhN1RoSjQvOW5yZytvN2ZrVHdINFYyUnF4Y2VhSjlCaGNaQ3REMmxPWHVsM1Q3QzkxYStnMDNUb1dudWJsaEZIR295WFpxL1Fid240ZThPL0FMd0pOcm12c3I2bEtvTnhJdjNwSlA0WW8raHdPZjFQMDUvNEsvREt5K0hXaXkrUGZHVzJDK01UU0FTOGZaSVAwK2R2ejUyK3VmbVQ0cy9FMisrSkd2dE1tNkhTN1ZtU3poSjQyLzMyOTJ4bjI2ZXBQaVY1U3hWWDJVZmdqdWZtK1kxNm1kWXI2cFFsKzVodSsva2NsNDI4WWF2NDQ4UVhHdjZ5MkpKU1JIR0RrUlI5UXEvN3RjclJSWHQwb3hoSGxpZnBXRndzS01Jd2hIbGpFS0tLS3MyQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FQLy9RL0graWlpdnNENXNLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ3ZwajRBL0dBZUZicGZDUGlLY25TTHBqNUVqSC9qMW1mLzJSajE3QW5Qcm41bm9yREZZV05hUExJOHZPTXBwWTJqS2hXKzBmZFB4QS9aMHRkZThYeDYxb3R5bW42WGVGcEw5Ui9BMzNtTUs5UG05T2dQUHNQQnZpVjhTWTNzVjhDK0NMVjlIOE4ybnlHTWdwTGR0L2ZtUERIZDZINnQyQTZEd0QrMGo0aDhLNmZhYUhyZG11cldkc05rY20vWktrZjhJM2NnaGUzR2NWN3REOFRQZ1g4VW9oYStJNFlJYnFUalpxTVhsU0wvdXpMLzhBRlY4OSsrb3lqN1dONHhQektMekRBemo5ZnBPcENHelg1MlB6NW9yN2w4UWZzdmVGdFhqKzIrRE5Xa3N0K0NpeUh6NEQ2N1dYNWdQZjVxK2UvRTN3SitKUGhreU8rbW5VTGFNZjYyelBtajArN3hKLzQ2SzltaG1kQ3A4TWo3akx1TThCaXZkalBsbDJlaDQ5UlRwSTVJWkRGSXBSMTZnakJGTnJ2UHA0eXY3MFFvb29vS0NpaW5SUnl6U2lHRkM3dDBBR1NhQlNsWWJSWHNmaG40RWZFbnhKc2xHbkhUcmRoL3JidytWLzQ3OS8vd0FkcjZEOFAvc3crRk5JZ0Y5NDAxU1M4MllMS2pmWjRCNjdtNWI4UXkxNXRmTTZOUDRwSHl1WThaNWZocGNzcWw1ZGxxZUcvRGY0aTI4dGdudzI4ZFd6Nng0ZHVUdGpBVnBKclJ1elI3Y3R0SFRDOUI5MzBQdS93OC9aM3RQRGZpKzUxclhMbVBVTEN5Y1NhZUNNYjI2aDVsNXdWN0RQVUE5Z0R1WFB4TytCL3dBTVVlMzhOeFFTM0lCRzNUNC9NWTl2bW1iN3cvNEczMHJ3VDRnZnRIZUlQRmRoZGFMbzltdWsyTjBDa2piekpNOGZRZ3R3TU4vdTVyeUxWcTB2M01lV0xQaVp2TU1kT1VjRlNkS0UvaWIvQURSTDhldmk5L3dtZDQzaGp3OU9mN0dzNVAza2dJLzBxWmUvZktLZnU5aWZtOU1mTjFGRmZRNFdoR2pEMmNUOU55ZkthV0NveG9VZnNoUlJSWFFlb0ZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFILzBmeC9vb29yN0ErYkNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQU9sOFArTXZGUGhXVGY0YzFPNHNSbjdpUCs3UCs4clpWdnhVMTlDK0dmMnAvRWRqdGg4VTZiRnFLRE9aWVQ1TW50bGZtVnZvTnRmS3RGY3RmQTBxbnhSUER6SGh2Qll5UDcrQy9VL1FsUEhud0crS3NRdDlmVzNpdW0rWEYrbmtTai9kbVgvNHF1VThTZnN0YUZmbzF6NE0xWjdNdGdyRmNmdll6NjdaRnd5L2p1TmZFTmRaNGI4ZCtNUENzb1BoN1ZyaXlYUDhBcXcyNkk5OG1Oc29meEZlYi9aYzZmdlVKbnlzK0VjVmhmZXkvRU9QOTE2bXo0NitGdmpINGVsSmZFTnNwdHBHMlIzRVQ3NDJiMDdNT25kYWY0RytGUGpINGdxOXhvRUNMYVJOc2t1Sm4yUnEzcDNZOWV5MTliZnRQc3pmRGl6a1k4bS9oL3dEUmNsSDdOVWpRL0M2NmFNOHBlM0JCL3dCcnk0NnovdFNyOVY5cDlvNHY5Y2NYL1pIMXZUbnZZd2ZEbjdMWGg3VGtGMzR4MVo3d3JrdkZBUEtpSHB1a2I1aitHMDExTW54QytCSHdzUnJmdzZ0dkxkTDh1TEJQUGxQKzlNMy9BTVZYeEI0ajhiK0svRmNoZnhEcXR4ZURKK1JteEVQOTJOY0lQd0FybGExamxrNm52VjVuYlM0T3hXSzk3TU1RMzVMUkgxUDRtL2FuOFNYMitId3RZUmFZall4TEtSTEwvd0I4L2NYOGQxZlBYaUR4YjRuOFZTbC9FT3AzRjkvc3lQOEFJUDhBZFhoVi9CYTUyaXZSb1lHbFQrR0o5WmwzRHVDd2kvY1FYNmhSUlJYVWUwRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBZi8wdngvb29vcjdBK2JDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0FweWZmRk5weWZmRkV5YXUwajc5L2FkL3dDU2EyUC9BRi9RL3dEb21TbWZzMy84a3J2UCt2eTYvd0RSY2RIN1R2OEF5VGV5L3dDditILzBWSlIremRuL0FJVlRlZjhBWDdkZitpNDYrTy81aFBtZmdjWmY4SVVmOFo4Q3QxcHRPYnJUYSt4ajhKKytVdG9oUlJSUVVGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFBVVVVVUFGRkZGQUgvMC94L29vb3I3QStiQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBcFY2N2xwS0tBUHZLMC9haDhCUzJVRWVvNmJlbVpWSG1LSTBaQTIzK0hjNFA4QUttYWorMC80Q0dtM0VXbWFiZS9hSFJoR3JSb3NlNWwvaTJzVC93Q08xOElVVjVQOWhVRDRQL2lIZVg4M05yOTRuKzlTMFVWNng5NEZGRkZBQlJSUlFBVVVVVUFGRkZGQUJSUlJRQVVVVVVBRkZGRkFCUlJSUUFVVVVVQUZGRkZBQlJSUlFCLy8xUHgvb29vcjdBK2JDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQVAvL1YvSCtpaWl2c0Q1c0tLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BLy85YjhmNktLSyt3UG13b29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0QvLzEveC9vb29yN0ErYkNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBQ2lpaWdBb29vb0FLS0tLQUNpaWlnQW9vb29BS0tLS0FDaWlpZ0Fvb29vQUtLS0tBUC8vWiIgeD0iLTIwMCIgeT0iLTIwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiPjwvaW1hZ2U+CjwvZz4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSA1NDAgOTY5KSIgc3R5bGU9IiIgaWQ9IjE5MGM5ZmVjLTNhYzktNGRjMS04NWE2LWQ0YzIzNDg0NzdhNCIgID4KCQk8dGV4dCB4bWw6c3BhY2U9InByZXNlcnZlIiBmb250LWZhbWlseT0iQWxlZ3JleWEiIGZvbnQtc2l6ZT0iODAiIGZvbnQtc3R5bGU9Im5vcm1hbCIgZm9udC13ZWlnaHQ9IjcwMCIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiA0OyBmaWxsOiByZ2IoMjU1LDI1NSwyNTUpOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IHdoaXRlLXNwYWNlOiBwcmU7IiA+PHRzcGFuIHg9Ii0zNTIuMiIgeT0iMjUuMTMiID5Db250ZW50IG5vdCBhdmFpbGFibGU8L3RzcGFuPjwvdGV4dD4KPC9nPgo8L3N2Zz4='
  if (uri.slice(0, 4) !== 'ipfs') {
    return uri.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\/ipfs\//, 'https://tempus.mypinata.cloud/ipfs/')
  }
  if (uri.indexOf('ipfs://ipfs/') !== -1) return uri.replace('ipfs://ipfs/', 'https://tempus.mypinata.cloud/ipfs/')
  return uri.replace('ipfs://', 'https://tempus.mypinata.cloud/ipfs/')
}
