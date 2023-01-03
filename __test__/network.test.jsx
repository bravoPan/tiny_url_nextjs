import { dnsCheck, DNS_STATUS } from "../modules/network/dNSCheck"

// TODO: learn how to import modules and test by jtest
test('existed dns check', () => {
    const existedDNSList = [
        "google.com",
    ]

    existedDNSList.forEach(dns=>{
        expect(dnsCheck(dns)).toBe(DNS_STATUS.SUCCESS);
    })

})