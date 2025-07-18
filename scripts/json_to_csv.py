import json
import csv
import os

json_dir = '/Users/koyo/vector-similarity-calculator/cyanite-vector'
output_csv_path = '/Users/koyo/vector-similarity-calculator/public/song_data.csv'
vector_keys_path = '/Users/koyo/vector-similarity-calculator/public/vector_keys.json'

# Load vector keys once
try:
    with open(vector_keys_path, 'r', encoding='utf-8') as f:
        VECTOR_KEYS = json.load(f)
except FileNotFoundError:
    print(f"오류: {vector_keys_path} 파일을 찾을 수 없습니다. 'extract_vector_keys.py'를 먼저 실행하세요.")
    VECTOR_KEYS = {}
except json.JSONDecodeError as e:
    print(f"오류: {vector_keys_path} JSON 파싱 오류: {e}")
    VECTOR_KEYS = {}

def extract_vector_values(data_object, field_name):
    if not isinstance(data_object, dict):
        return '[]'
    
    # Get the predefined order of keys for this field
    predefined_keys = VECTOR_KEYS.get(field_name, [])
    
    values = []
    for key in predefined_keys:
        values.append(data_object.get(key, 0)) # Use 0 as default for missing keys
    
    return str(values)

csv_data = []
# CSV 헤더 정의
csv_data.append(['id', 'title', 'bpm', 'key', 'time_signature', 'valence', 'arousal', 'voice', 'musicalEraTag', 'advancedInstrumentPresenceExtended', 'mood', 'moodAdvanced', 'genre', 'advancedGenre', 'advancedSubgenre', 'character', 'movement', 'transformerCaption'])

for filename in os.listdir(json_dir):
    if filename.lower().endswith('.json'):
        filepath = os.path.join(json_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                track_data = data.get('libraryTrack', {})
                analysis_result = track_data.get('audioAnalysisV7', {}).get('result', {})
                
                song_id = track_data.get('id', '')
                title = track_data.get('title', '')
                bpm = analysis_result.get('bpmPrediction', {}).get('value', '')
                key = analysis_result.get('keyPrediction', {}).get('value', '')
                time_signature = analysis_result.get('timeSignature', '')
                
                mood_vector = extract_vector_values(analysis_result.get('mood', {}), 'mood')
                genre_vector = extract_vector_values(analysis_result.get('genre', {}), 'genre')
                character_vector = extract_vector_values(analysis_result.get('character', {}), 'character')
                movement_vector = extract_vector_values(analysis_result.get('movement', {}), 'movement')
                
                valence = analysis_result.get('valence', '')
                arousal = analysis_result.get('arousal', '')
                voice_vector = extract_vector_values(analysis_result.get('voice', {}), 'voice')
                musical_era_tag = analysis_result.get('musicalEraTag', '')
                advanced_instrument_presence_extended_vector = extract_vector_values(analysis_result.get('advancedInstrumentPresenceExtended', {}), 'advancedInstrumentPresenceExtended')
                mood_advanced_vector = extract_vector_values(analysis_result.get('moodAdvanced', {}), 'moodAdvanced')
                advanced_genre_vector = extract_vector_values(analysis_result.get('advancedGenre', {}), 'advancedGenre')
                advanced_subgenre_vector = extract_vector_values(analysis_result.get('advancedSubgenre', {}), 'advancedSubgenre')
                transformer_caption = analysis_result.get('transformerCaption', '')

                current_row = [
                    song_id, title, bpm, key, time_signature,
                    valence, arousal, voice_vector, musical_era_tag,
                    advanced_instrument_presence_extended_vector,
                    mood_vector, mood_advanced_vector,
                    genre_vector, advanced_genre_vector, advanced_subgenre_vector,
                    character_vector, movement_vector, transformer_caption
                ]
                csv_data.append(current_row)
        except json.JSONDecodeError as e:
            print(f"오류: {filename} JSON 파싱 오류: {e}")
        except Exception as e:
            print(f"오류: {filename} 처리 중 예외 발생: {e}")

with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerows(csv_data)

print(f"CSV 파일이 성공적으로 생성되었습니다: {output_csv_path}")
