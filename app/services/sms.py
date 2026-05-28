import os
from typing import Optional

VONAGE_API_KEY = os.getenv("VONAGE_API_KEY", "")
VONAGE_API_SECRET = os.getenv("VONAGE_API_SECRET", "")
VONAGE_PHONE_NUMBER = os.getenv("VONAGE_PHONE_NUMBER", "")
SMS_ENABLED = bool(VONAGE_API_KEY and VONAGE_API_SECRET)


def send_sms(to: str, message: str) -> dict:
    """
    Send an SMS to the given phone number using Vonage.
    Returns a dict with 'success', 'message_id', and optionally 'error'.
    """
    if not SMS_ENABLED:
        # Simulation mode: log the message but do not send
        print(f"[SMS SIMULATION Vonage] To: {to} | Message: {message}")
        return {"success": True, "message_id": "SIMULATED", "simulated": True}

    try:
        import vonage
        from vonage import Auth, Vonage
        from vonage_sms import SmsMessage, SendSmsResponse

        client = Vonage(Auth(api_key=VONAGE_API_KEY, api_secret=VONAGE_API_SECRET))
        
        # Ensure 'to' number is in E.164 format and remove spaces
        to = to.replace(" ", "").replace("-", "")
        if not to.startswith("+"):
            # Vonage prefers no '+' but 'to' field in library handles it or needs digits only
            # The modern 'vonage' client usually expects digits only for 'to'
            to = to.lstrip("+")

        response: SendSmsResponse = client.sms.send(
            SmsMessage(
                to=to,
                from_=VONAGE_PHONE_NUMBER or "VonageAPI",
                text=message
            )
        )

        if response.messages[0].status == "0":
            return {"success": True, "message_id": response.messages[0].message_id}
        else:
            return {"success": False, "error": response.messages[0].error_text}

    except Exception as e:
        return {"success": False, "error": str(e)}
