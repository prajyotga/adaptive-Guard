import axios from "axios";

const API_URL = "http://localhost:5000/api/test";
const API_KEY = "ag_60b6c1812e8eee68705632da28079a13b6f27153ecb74e0f";

const sendRequest = async (requestNumber: number) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                "x-api-key": API_KEY
            }
        });

        console.log(
            `Request ${requestNumber} → ${response.status}`
        );

    } catch (error: any) {
        console.log(
            `Request ${requestNumber} → ${
                error.response?.status || "ERROR"
            }`
        );
    }
};

const run = async () => {
    for (let i = 1; i <= 50; i++) {
        await sendRequest(i);
    }
};

run();