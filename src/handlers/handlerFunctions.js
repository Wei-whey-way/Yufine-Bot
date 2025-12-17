// GPT Response
export async function gptResponse(input, member){
    input = input.replace(/^yufine[, ]*/i, '').trim(); // Remove "Yufine" from the start of the input
    console.log('Response called with input:', input, 'from member:', member);

    // Call n8n webhook if available
    const n8n_response = await fetch("http://localhost:5678/webhook/n8n-call", {
    // const n8n_response = await fetch("http://localhost:5678/webhook-test/n8n-call", { // Testing request
        method: "POST",
        body: JSON.stringify({ input: input, userId: member }),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
    
    // console.log('Debugging n8n response:', n8n_response.status, n8n_response.json());
    if (n8n_response.status === 200){
        // console.log('Success, Debugging n8n response:', n8n_response.output);

        const n8n_data = await n8n_response.json();
        const output = n8n_data["output"];
        // console.log('Debugging n8n data:', output);

        if (output === null || output === undefined || output == ''){
            return "Sorry, I couldn't generate a response at this time.";
        }
        return output;
    }

    // Call OpenAI API if n8n not available
    else {
    // if (n8n_response.status !== 200) {
        console.log('n8n response not 200, calling OpenAI API');
        return "ChatGPT functionality is currently under maintenance. Please try again later.";

        const gpt_response = await openai.responses.create({
            model: "gpt-5-nano",
            input: `${input}\nIMPORTANT: Keep your entire response under 2000 characters.`,
            store: true,
        });

        // const gpt_response = null;
        // console.log('Debugging GPT response:', gpt_response.output_text, 'input was:', input);

        if (gpt_response == null || gpt_response.output_text == null || gpt_response.output_text == ''){
            return "Sorry, I couldn't generate a response at this time.";
        }

        let output = gpt_response.output_text;
        
        // Hard limit safeguard edge case
        if (output.length > 2000) {
            // output = output.substring(0, 2000 - 3) + "...";
            shorten_response = await openai.responses.create({
                model: "gpt-5-nano",
                input: `The previous response exceeded the character limit. Please provide a concise summary of the following text within 2000 characters:\n\n${output}`,
            });
        
            return shorten_response.output_text;
        } 

        return output;
    }
}

export function randomTimeout() {
    // Math.random() generates a random decimal between 0 and 1 (exclusive of 1)
    // We multiply it by 2 to get a number between 0 and 3.999...
    // Then we add 1 to make sure the result is between 1 and 4
    let durationMin = Math.floor((Math.random() * 60) + 5);
    let durationMs = durationMin * 60 * 1000; // Convert minutes to milliseconds
    
    return durationMs;
}