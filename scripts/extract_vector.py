import re
import sys

def extract_and_round_from_text(input_text):
    """
    Extracts all floating-point numbers from a given string,
    rounds them to four decimal places, and returns them as a list.
    
    Args:
        input_text: A multi-line string where each line may contain a float.
        
    Returns:
        A list of floats, rounded to 4 decimal places.
    """
    # Find all floating point numbers in the input text
    numbers = re.findall(r'[-+]?\d*\.\d+', input_text)
    
    # Convert found strings to float and round to 4 decimal places
    rounded_numbers = [round(float(num), 4) for num in numbers]
    
    return rounded_numbers

if __name__ == '__main__':
    # Check if data is being piped to the script
    if not sys.stdin.isatty():
        input_data = sys.stdin.read()
        result = extract_and_round_from_text(input_data)
        print(result)
    else:        
        # Example for demonstration if run directly
        text = """
afro: 0.0891497963323043
ambient: 0.02356778783723712
arab: 0.027349743490608838
asian: 0.0591860874914206
blues: 0.007168059702962637
childrenJingle: 0.03993401977305229
classical: 0.007578019151249184
electronicDance: 0.2614011403459769
folkCountry: 0.005679409440535192
funkSoul: 0.0515363050911289
indian: 0.005272380837525886
jazz: 0.043183124355541974
latin: 0.0065140318877708455
metal: 0.00238200667529152
pop: 0.13178059401420447
rapHipHop: 0.07371248620060775
reggae: 0.025183752895547792
rnb: 0.14955754277224725
rock: 0.03303188271820545
singerSongwriters: 0.015339749292112313
sound: 0.0046677416674076365
soundtrack: 0.13690416959042734
spokenWord: 0.0050787342300352
"""
        result = extract_and_round_from_text(text)
        print(result)
