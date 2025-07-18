import json
import os

json_dir = '/Users/koyo/vector-similarity-calculator/cyanite-vector'
output_json_path = '/Users/koyo/vector-similarity-calculator/public/vector_keys.json'

def extract_keys_from_vector_object(data_object):
    if isinstance(data_object, dict):
        return list(data_object.keys())
    return []

def main():
    all_vector_keys = {
        'mood': set(),
        'genre': set(),
        'character': set(),
        'movement': set(),
        'voice': set(),
        'advancedInstrumentPresenceExtended': set(),
        'moodAdvanced': set(),
        'advancedGenre': set(),
        'advancedSubgenre': set(),
    }

    json_files_found = False
    for filename in os.listdir(json_dir):
        if filename.lower().endswith('.json'):
            json_files_found = True
            filepath = os.path.join(json_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                analysis_result = data.get('libraryTrack', {}).get('audioAnalysisV7', {}).get('result', {})

                vector_fields = {
                    'mood': analysis_result.get('mood', {}),
                    'genre': analysis_result.get('genre', {}),
                    'character': analysis_result.get('character', {}),
                    'movement': analysis_result.get('movement', {}),
                    'voice': analysis_result.get('voice', {}),
                    'advancedInstrumentPresenceExtended': analysis_result.get('advancedInstrumentPresenceExtended', {}),
                    'moodAdvanced': analysis_result.get('moodAdvanced', {}),
                    'advancedGenre': analysis_result.get('advancedGenre', {}),
                }

                for field_name, field_data in vector_fields.items():
                    keys = extract_keys_from_vector_object(field_data)
                    all_vector_keys[field_name].update(keys)

            except json.JSONDecodeError as e:
                print(f"오류: {filename} JSON 파싱 오류: {e}")
            except Exception as e:
                print(f"오류: {filename} 처리 중 예외 발생: {e}")

    if not json_files_found:
        print(f"경고: {json_dir}에서 JSON 파일을 찾을 수 없습니다. 경로를 확인하세요.")
        return

    sorted_extracted_keys = {}
    for field_name, keys_set in all_vector_keys.items():
        sorted_extracted_keys[field_name] = sorted(list(keys_set))

    try:
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(sorted_extracted_keys, f, indent=4, ensure_ascii=False)
        print(f"벡터 키가 성공적으로 추출되어 {output_json_path}에 저장되었습니다.")
    except Exception as e:
        print(f"오류: {output_json_path}에 벡터 키를 저장하는 중 예외 발생: {e}")

if __name__ == '__main__':
    main()