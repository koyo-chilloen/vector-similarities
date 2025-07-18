import json
import os

json_dir = '/Users/koyo/vector-similarity-calculator/cyanite-vector'

def analyze_genre_tags_threshold():
    print(f"분석할 JSON 디렉토리: {json_dir}")
    json_files_found = False
    
    for filename in os.listdir(json_dir):
        if filename.lower().endswith('.json'):
            json_files_found = True
            filepath = os.path.join(json_dir, filename)
            print(f"\n--- 파일 분석 중: {filename} ---")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                analysis_result = data.get('libraryTrack', {}).get('audioAnalysisV7', {}).get('result', {})
                
                genre_vector = analysis_result.get('genre', {})
                genre_tags = analysis_result.get('genreTags', [])
                
                if not genre_vector:
                    print("  (Genre vector not found or empty)")
                    continue

                print("Genre Vector Values (Sorted by Value, Tagged Status):")
                
                tagged_values = []
                untagged_values = []

                # Sort genre vector items by value in descending order
                sorted_genre_items = sorted(genre_vector.items(), key=lambda item: item[1], reverse=True)
                
                for key, value in sorted_genre_items:
                    is_tagged = key in genre_tags
                    print(f"  {key}: {value:.4f} {'(TAGGED)' if is_tagged else ''}")
                    if is_tagged:
                        tagged_values.append(value)
                    else:
                        untagged_values.append(value)
                
                print("Genre Tags:")
                if genre_tags:
                    for tag in genre_tags:
                        print(f"  - {tag}")
                else:
                    print("  (Genre tags not found or empty)")

                if tagged_values:
                    min_tagged_value = min(tagged_values)
                    print(f"  -> Lowest TAGGED value: {min_tagged_value:.4f}")
                else:
                    min_tagged_value = None

                if untagged_values:
                    max_untagged_value = max(untagged_values)
                    print(f"  -> Highest UNTAGGED value: {max_untagged_value:.4f}")
                else:
                    max_untagged_value = None
                
                if min_tagged_value is not None and max_untagged_value is not None:
                    print(f"  -> Difference (Lowest TAGGED - Highest UNTAGGED): {min_tagged_value - max_untagged_value:.4f}")

            except json.JSONDecodeError as e:
                print(f"오류: {filename} JSON 파싱 오류: {e}")
            except Exception as e:
                print(f"오류: {filename} 처리 중 예외 발생: {e}")

    if not json_files_found:
        print(f"경고: {json_dir}에서 JSON 파일을 찾을 수 없습니다. 경로를 확인하세요.")

if __name__ == '__main__':
    analyze_genre_tags_threshold()