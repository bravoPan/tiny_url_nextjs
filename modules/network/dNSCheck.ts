import axios from 'axios'

export enum DNS_STATUS{
    SUCCESS,
    FAIL
}

// TODO: Check whether dns is existed to not.
export const dnsCheck = async (dns:string) => {
    try{
        const { data, status } = await axios.get(
            dns,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: 'text/html',
              },
            },
          );
        console.log(data, status);
        return DNS_STATUS.SUCCESS;
    } catch (error) {
        console.log("error message: ", error);
        return DNS_STATUS.FAIL
    }
}