import axios from "axios";

const API_URL = "http://localhost:5000/api/test";
const API_KEY = "ag_60b6c1812e8eee68705632da28079a13b6f27153ecb74e0f";

const sendRequest = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                "x-api-key": API_KEY
            }
        });

        console.log(
            `Status: ${response.status} | ${response.data.message}`
        );
    } catch (error: any) {
        console.log(
            `Status: ${error.response?.status || "ERROR"}`
        );
    }
};

const run = async () => {
    for (let i = 0; i < 10; i++) {
        await sendRequest();

        await new Promise(resolve =>
            setTimeout(resolve, 3000)
        );
    }
};

run();