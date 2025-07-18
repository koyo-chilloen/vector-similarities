import json
import csv
import os

json_dir = '/Users/koyo/vector-similarity-calculator/cyanite-vector'
output_csv_path = '/Users/koyo/vector-similarity-calculator/public/top_5_genres.csv'

def extract_top_genres():
    csv_data = []
    # CSV 헤더 정의
    header = ['id', 'title', 'genre_tags']
    for i in range(1, 6):
        header.extend([f'genre{i}_name', f'genre{i}_value'])
    csv_data.append(header)

    json_files_found = False
    for filename in os.listdir(json_dir):
        if filename.lower().endswith('.json'):
            json_files_found = True
            filepath = os.path.join(json_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                track_data = data.get('libraryTrack', {})
                analysis_result = track_data.get('audioAnalysisV7', {}).get('result', {})
                
                song_id = track_data.get('id', '')
                title = track_data.get('title', '')
                genre_vector = analysis_result.get('genre', {})
                genre_tags = analysis_result.get('genreTags', [])
                
                current_row = [song_id, title, str(genre_tags)]
                
                if genre_vector:
                    # Sort genre vector items by value in descending order
                    sorted_genre_items = sorted(genre_vector.items(), key=lambda item: item[1], reverse=True)
                    
                    # Take top 5 genres
                    for i in range(min(5, len(sorted_genre_items))):
                        genre_name, genre_value = sorted_genre_items[i]
                        current_row.extend([genre_name, f'{genre_value:.4f}'])
                    
                    # Fill remaining columns if less than 5 genres
                    for _ in range(5 - len(sorted_genre_items)):
                        current_row.extend(['', ''])
                else:
                    # Fill with empty values if no genre vector
                    for _ in range(5):
                        current_row.extend(['', ''])
                
                csv_data.append(current_row)

            except json.JSONDecodeError as e:
                print(f"오류: {filename} JSON 파싱 오류: {e}")
            except Exception as e:
                print(f"오류: {filename} 처리 중 예외 발생: {e}")

    if not json_files_found:
        print(f"경고: {json_dir}에서 JSON 파일을 찾을 수 없습니다. 경로를 확인하세요.")
        return

    try:
        with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerows(csv_data)
        print(f"상위 5개 장르 데이터가 성공적으로 {output_csv_path}에 저장되었습니다.")
    except Exception as e:
        print(f"오류: {output_csv_path}에 CSV 데이터를 저장하는 중 예외 발생: {e}")

if __name__ == '__main__':
    extract_top_genres()