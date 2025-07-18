import csv
import json
import statistics

input_csv_path = '/Users/koyo/vector-similarity-calculator/public/genreTag_research_data.csv'

def test_hypothesis():
    print("--- Genre Tag Hypothesis Test (Standard Deviation Based) ---")
    
    total_songs = 0
    matches = 0

    try:
        with open(input_csv_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            # Get all genre keys from the header (excluding id, title, genre_tags)
            all_genre_keys_from_csv = [key for key in reader.fieldnames if key not in ['id', 'title', 'genre_tags']]

            for row in reader:
                total_songs += 1
                song_id = row['id']
                title = row['title']
                
                # Parse actual genre_tags
                actual_genre_tags_str = row['genre_tags']
                try:
                    actual_genre_tags = json.loads(actual_genre_tags_str.replace('\'', '"'))
                except json.JSONDecodeError:
                    actual_genre_tags = []

                # Extract all genre values for the current song
                current_song_genre_values = []
                genre_value_map = {}
                for genre_key in all_genre_keys_from_csv:
                    try:
                        value = float(row.get(genre_key, 0))
                        current_song_genre_values.append(value)
                        genre_value_map[genre_key] = value
                    except ValueError:
                        pass # Skip if value is not a valid float
                
                if not current_song_genre_values:
                    print(f"경고: {title} ({song_id})에 대한 장르 값을 찾을 수 없습니다. 건너뜁니다.")
                    continue

                # Calculate standard deviation and highest value
                std_dev = statistics.stdev(current_song_genre_values) if len(current_song_genre_values) > 1 else 0
                highest_genre_value = max(current_song_genre_values)

                predicted_tags = []
                # Apply new hypothesis
                threshold = highest_genre_value - (std_dev * 1.0) # Factor of 1.0 for std_dev
                min_absolute_threshold = 0.01 # Absolute minimum value

                for genre_name, genre_value in genre_value_map.items():
                    if genre_value > min_absolute_threshold and genre_value >= threshold:
                        predicted_tags.append(genre_name)
                
                # Sort both lists for consistent comparison
                actual_genre_tags.sort()
                predicted_tags.sort()

                is_match = (actual_genre_tags == predicted_tags)
                if is_match:
                    matches += 1
                
                print(f"\n--- Song: {title} (ID: {song_id}) ---")
                print(f"  Highest Genre Value: {highest_genre_value:.4f}")
                print(f"  Standard Deviation: {std_dev:.4f}")
                print(f"  Calculated Threshold (Highest - StdDev * 1.0): {threshold:.4f}")
                print(f"  Actual Genre Tags: {actual_genre_tags}")
                print(f"  Predicted Genre Tags: {predicted_tags}")
                print(f"  Match: {is_match}")

    except FileNotFoundError:
        print(f"오류: {input_csv_path} 파일을 찾을 수 없습니다. 'extract_all_genres_for_research.py'를 먼저 실행하세요.")
        return
    except Exception as e:
        print(f"오류: 스크립트 실행 중 예외 발생: {e}")

    print(f"\n--- Test Summary ---")
    print(f"Total Songs: {total_songs}")
    print(f"Matches: {matches}")
    print(f"Accuracy: {matches / total_songs * 100:.2f}%" if total_songs > 0 else "Accuracy: N/A")

if __name__ == '__main__':
    test_hypothesis()
