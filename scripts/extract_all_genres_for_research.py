import json
import csv
import os

json_dir = '/Users/koyo/vector-similarity-calculator/cyanite-vector'
output_csv_path = '/Users/koyo/vector-similarity-calculator/public/genreTag_research_data.csv'

def extract_all_genres_for_research():
    all_genre_keys = set()
    all_songs_data = []

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
                
                song_data = {
                    'id': song_id,
                    'title': title,
                    'genre_tags': str(genre_tags) # Store as string representation of list
                }
                
                # Add all genre keys from this song to the master set of all keys
                for key in genre_vector.keys():
                    all_genre_keys.add(key)
                
                # Store genre vector values for this song
                song_data['genre_values'] = genre_vector
                all_songs_data.append(song_data)

            except json.JSONDecodeError as e:
                print(f"오류: {filename} JSON 파싱 오류: {e}")
            except Exception as e:
                print(f"오류: {filename} 처리 중 예외 발생: {e}")

    if not json_files_found:
        print(f"경고: {json_dir}에서 JSON 파일을 찾을 수 없습니다. 경로를 확인하세요.")
        return

    # Sort all unique genre keys alphabetically for consistent column order
    sorted_all_genre_keys = sorted(list(all_genre_keys))

    # Define CSV header
    header = ['id', 'title', 'genre_tags'] + sorted_all_genre_keys
    csv_rows = [header]

    # Populate CSV rows
    for song_data in all_songs_data:
        row = [
            song_data['id'],
            song_data['title'],
            song_data['genre_tags']
        ]
        for genre_key in sorted_all_genre_keys:
            # Get value, default to 0 if not present in this song's genre vector
            value = song_data['genre_values'].get(genre_key, 0)
            row.append(f'{value:.4f}') # Format to 4 decimal places
        csv_rows.append(row)

    try:
        with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            csv_writer = csv.writer(csvfile)
            csv_writer.writerows(csv_rows)
        print(f"모든 장르 데이터가 성공적으로 {output_csv_path}에 저장되었습니다.")
    except Exception as e:
        print(f"오류: {output_csv_path}에 CSV 데이터를 저장하는 중 예외 발생: {e}")

if __name__ == '__main__':
    extract_all_genres_for_research()