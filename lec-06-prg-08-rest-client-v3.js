const axios = require('axios');

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000'
});

// Build form data
function formData(obj) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries (obj)) {
        params.append (k, v);
    }
    return params;
}

(async () => {
    try {
    // Test #1: read non-existing member
    let r = await api.get("/membership_api/0001");
    console.log("#1 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);

    // Test #2: create new member
    r = await api.post("/membership_api/0001", formData({ "0001": "apple" }));
    console.log("#2 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);

    // Test #3: read registered member
    r = await api.get("/membership_api/0001");
    console.log("#3 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);
    // Test #4: create an already existing member
    r = await api.post("/membership_api/0001", formData({ "0001": "xpple" }));
    console.log("#4 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);

    // Test #5: update non-registered member
    r = await api.put("/membership_api/0002", formData({ "0002": "xrange" }));
    console.log("#5 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0002"]);
    // Test #6: update registered member
    await api.post("/membership_api/0002", formData({ "0002": "xrange" }));
    r = await api.put("/membership_api/0002", formData({ "0002": "orange" }));
    console.log("#6 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0002"]);

    // Test #7: delete registered member
    r = await api.delete("/membership_api/0001");
    console.log("#7 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);
    // Test #8: delete non registered member
    r = await api.delete("/membership_api/0001");
    console.log("#8 Code", r.status, ">>", "JSON", r.data, ">>", "JSON Result", r.data["0001"]);

} catch (error) {
    // Basic error handling
    if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
    } else {
        console.log("Error", error.message);
    }
}

})();